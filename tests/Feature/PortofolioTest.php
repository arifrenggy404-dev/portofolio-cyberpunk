<?php

namespace Tests\Feature;

use App\Models\Proyek;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortofolioTest extends TestCase
{
    use RefreshDatabase;

    public function test_halaman_utama_portofolio_dapat_diakses(): void
    {
        $this->seed(\Database\Seeders\SeederProyek::class);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Portofolio')
            ->has('proyek', 2)
            ->where('proyek.0.nama_proyek', 'Sistem Informasi Keamanan Neo-Tokyo')
        );
    }
}
