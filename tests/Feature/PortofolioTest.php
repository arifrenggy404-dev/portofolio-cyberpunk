<?php

namespace Tests\Feature;

use Database\Seeders\SeederProyek;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortofolioTest extends TestCase
{
    use RefreshDatabase;

    public function test_halaman_identitas_dapat_diakses(): void
    {
        $response = $this->get('/identitas');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Identitas')
        );
    }

    public function test_halaman_misi_dapat_diakses(): void
    {
        $this->seed(SeederProyek::class);

        $response = $this->get('/misi');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Misi')
            ->has('proyek', 2)
        );
    }
}
