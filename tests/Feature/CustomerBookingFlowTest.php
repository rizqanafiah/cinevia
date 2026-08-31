<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CustomerBookingFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_access_booking_index_and_staff_can_access_verification_queue(): void
    {
        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

        $customer = User::factory()->create();
        $customer->assignRole('customer');

        $this->actingAs($customer)
            ->get('/bookings')
            ->assertOk();

        $staff = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $staff->assignRole('staff');

        $this->actingAs($staff)
            ->get('/bookings')
            ->assertOk();

        $this->actingAs($staff)
            ->get('/staff/payments')
            ->assertOk();
    }

    public function test_customer_can_select_seat_and_create_booking(): void
    {
        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        $customer = User::factory()->create();
        $customer->assignRole('customer');

        $movie = \App\Models\Movie::factory()->create();
        $studio = \App\Models\Studio::factory()->create();
        $seat = \App\Models\Seat::factory()->create([
            'studio_id' => $studio->id,
            'seat_label' => 'A1',
        ]);
        $showtime = \App\Models\Showtime::factory()->create([
            'movie_id' => $movie->id,
            'studio_id' => $studio->id,
            'ticket_price' => 50000,
        ]);

        $this->actingAs($customer)
            ->get('/showtimes/' . $showtime->id . '/seats')
            ->assertOk();

        $this->actingAs($customer)
            ->post('/bookings', [
                'showtime_id' => $showtime->id,
                'seat_ids' => [$seat->id],
            ])
            ->assertRedirect();
    }

    public function test_customer_can_upload_payment_proof_and_staff_can_verify_it(): void
    {
        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

        $customer = User::factory()->create();
        $customer->assignRole('customer');

        $staff = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $staff->assignRole('staff');

        $movie = \App\Models\Movie::factory()->create();
        $studio = \App\Models\Studio::factory()->create();
        $seat = \App\Models\Seat::factory()->create([
            'studio_id' => $studio->id,
            'seat_label' => 'A2',
        ]);
        $showtime = \App\Models\Showtime::factory()->create([
            'movie_id' => $movie->id,
            'studio_id' => $studio->id,
            'ticket_price' => 50000,
        ]);

        $booking = \App\Models\Booking::create([
            'user_id' => $customer->id,
            'showtime_id' => $showtime->id,
            'booking_code' => 'CNV-TEST-001',
            'status' => \App\Enums\StatusBooking::MENUNGGU,
            'total_price' => 50000,
            'expired_at' => now()->addMinutes(30),
        ]);

        \App\Models\BookingSeat::create([
            'booking_id' => $booking->id,
            'seat_id' => $seat->id,
        ]);

        \App\Models\Payment::create([
            'booking_id' => $booking->id,
            'amount' => 50000,
            'status' => \App\Enums\StatusPembayaran::BELUM_BAYAR,
        ]);

        $this->actingAs($customer)
            ->post('/payments/' . $booking->id . '/upload', [
                'bukti_pembayaran' => \Illuminate\Http\UploadedFile::fake()->image('proof.jpg'),
            ])
            ->assertRedirect();

        $payment = $booking->fresh()->payment;
        $this->assertSame(\App\Enums\StatusPembayaran::MENUNGGU_VERIFIKASI->value, $payment->status->value);

        $this->actingAs($staff)
            ->post('/staff/payments/' . $payment->id . '/verify', [
                'aksi' => 'verifikasi',
            ])
            ->assertRedirect();

        $payment->refresh();
        $this->assertSame(\App\Enums\StatusPembayaran::LUNAS->value, $payment->status->value);
        $this->assertSame(\App\Enums\StatusBooking::DIKONFIRMASI->value, $booking->fresh()->status->value);
    }
}
