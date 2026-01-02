<?php

namespace App\Jobs;

use App\Models\CartItem;
use App\Mail\DailySalesReportMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class DailySalesReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $today = Carbon::today();

        $soldItems = CartItem::with('product')
            ->whereDate('updated_at', $today)
            ->get();

        if ($soldItems->isEmpty()) {
            return;
        }

        Mail::to('admin@example.com')
            ->send(new DailySalesReportMail($soldItems));
    }
}
