<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/{page?}', function () {
    return view('admin');
})->middleware(['auth', 'verified'])
    ->where('page', '.*')
    ->name('admin');

Route::get('/dashboard/{page?}', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])
    ->where('page', '.*')
    ->name('dashboard');

Route::get('/impersonate/{email?}', App\Http\Requests\Impersonate::class);

Route::get('/wyxos/errors', function () {
    if (app()->environment('production')) {
        abort(404);
    }

    $lines = [];
    $fp = fopen(base_path('storage/logs/laravel.log'), 'r');
    while (!feof($fp)) {
        $line = fgets($fp, 4096);
        array_push($lines, $line);
        if (count($lines) > 500) {
            array_shift($lines);
        }
    }
    fclose($fp);

    return view('errors')->with([
        'lines' => $lines
    ]);
});

Route::middleware('auth')->group(function () {
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
