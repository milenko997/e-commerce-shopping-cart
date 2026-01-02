<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CartController;

Route::get('/', [HomeController::class, 'index']);

Route::middleware('auth')->group(function () {

    Route::get('/cart', function () {
        return Inertia::render('Cart/Index');
    })->name('cart');

    Route::get('/cart/data', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::patch('/cart/items/{item}', [CartController::class, 'update']);
    Route::delete('/cart/items/{item}', [CartController::class, 'remove']);
});

require __DIR__.'/settings.php';
