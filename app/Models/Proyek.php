<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;

#[Table('proyek')]
#[Fillable([
    'nama_proyek',
    'tautan_slug',
    'deskripsi',
    'teknologi_utama',
    'tautan_langsung',
    'tautan_github',
    'jalur_gambar',
])]
class Proyek extends Model
{
    protected function casts(): array
    {
        return [
            'teknologi_utama' => 'array',
        ];
    }
}
