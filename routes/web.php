<?php

use App\Models\Proyek;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Portofolio', [
        'proyek' => Proyek::all(),
    ]);
});
