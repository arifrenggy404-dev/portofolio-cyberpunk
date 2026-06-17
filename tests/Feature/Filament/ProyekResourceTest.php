<?php

namespace Tests\Feature\Filament;

use App\Models\User;
use App\Models\Proyek;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProyekResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_admin_dashboard()
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/admin/login');
    }

    public function test_guests_are_redirected_from_proyeks_index()
    {
        $response = $this->get('/admin/proyeks');

        $response->assertRedirect('/admin/login');
    }

    public function test_authenticated_users_can_access_admin_dashboard()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin');

        $response->assertSuccessful();
    }

    public function test_authenticated_users_can_access_proyeks_index()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin/proyeks');

        $response->assertSuccessful();
    }
}
