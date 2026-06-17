<?php

namespace Tests\Feature\API;

use Tests\TestCase;

class RuteApiTest extends TestCase
{
    public function test_api_ping_berhasil(): void
    {
        $response = $this->getJson('/api/ping');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'aktif',
                'pesan' => 'API Portofolio Cyberpunk siap',
            ]);
    }
}
