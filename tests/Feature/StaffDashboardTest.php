<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StaffDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_dashboard_displays_staff_specific_workflow(): void
    {
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

        $staff = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $staff->assignRole('staff');

        $response = $this->actingAs($staff)->get('/dashboard');

        $response->assertOk();
    }

    public function test_staff_and_admin_shared_verification_route_is_allowed_for_staff_role(): void
    {
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        $staff = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $staff->assignRole('staff');

        $response = $this->actingAs($staff)->get('/staff/payments');

        $response->assertOk();
    }
}
