<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $akunPerRole = [
            ['name' => 'Customer Demo', 'email' => 'customer@cinevia.test', 'role' => 'customer'],
            ['name' => 'Staff Demo', 'email' => 'staff@cinevia.test', 'role' => 'staff'],
            ['name' => 'Admin Demo', 'email' => 'admin@cinevia.test', 'role' => 'admin'],
        ];

        foreach ($akunPerRole as $dataAkun) {
            $user = User::updateOrCreate(
                ['email' => $dataAkun['email']],
                [
                    'name' => $dataAkun['name'],
                    'password' => Hash::make('Password123_'),
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles([$dataAkun['role']]);
        }
    }
}
