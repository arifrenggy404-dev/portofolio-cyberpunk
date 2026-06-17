<?php

use Illuminate\Support\Facades\Route;
use App\Models\Proyek;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Portofolio', [
        'proyek' => Proyek::all()
    ]);
});
