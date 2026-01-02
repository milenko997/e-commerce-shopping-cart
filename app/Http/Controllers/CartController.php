<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Jobs\CheckLowStock;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->with('items.product')->firstOrCreate([
            'user_id' => $request->user()->id
        ]);

        $cart->items->transform(function ($item) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'stock_quantity' => $item->product->stock_quantity,
                ],
            ];
        });

        return response()->json($cart);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $product = Product::lockForUpdate()->findOrFail($request->product_id);

            if ($product->stock_quantity < $request->quantity) {
                return response()->json(['message' => 'Not enough stock'], 422);
            }

            $cart = $request->user()->cart()->firstOrCreate([
                'user_id' => $request->user()->id
            ]);

            $item = $cart->items()->where('product_id', $product->id)->first();

            if ($item) {
                $item->increment('quantity', $request->quantity);
            } else {
                $cart->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $request->quantity,
                    'price' => $product->price,
                ]);
            }

            $product->decrement('stock_quantity', $request->quantity);

            if ($product->stock_quantity < 5) {
                CheckLowStock::dispatch($product);
            }

            return response()->json(['success' => true]);
        });
    }

    public function update(Request $request, CartItem $item)
    {
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request, $item) {
            $product = Product::lockForUpdate()->findOrFail($item->product_id);

            $newQuantity = $request->quantity;
            $oldQuantity = $item->quantity;

            $diff = $newQuantity - $oldQuantity;

            if ($diff > 0 && $diff > $product->stock_quantity) {
                return response()->json(['message' => 'Not enough stock'], 422);
            }

            $product->decrement('stock_quantity', max($diff, 0));

            if ($product->stock_quantity < 5) {
                CheckLowStock::dispatch($product);
            }

            $product->increment('stock_quantity', max(-$diff, 0));

            $item->update(['quantity' => $newQuantity]);

            return response()->json($item);
        });
    }


    public function remove(Request $request, CartItem $item)
    {
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return DB::transaction(function () use ($item) {
            $product = Product::lockForUpdate()->findOrFail($item->product_id);

            $product->increment('stock_quantity', $item->quantity);

            $item->delete();

            return response()->noContent();
        });
    }
}
