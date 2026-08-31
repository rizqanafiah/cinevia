<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CleanupDuplicateRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roles:cleanup {--dry-run : Tampilkan perubahan tanpa menyimpan}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Membersihkan role ganda agar setiap user memiliki maksimal satu role utama';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $users = User::with('roles')->get();
        $totalDibersihkan = 0;
        $prioritasRole = ['admin', 'staff', 'customer'];

        foreach ($users as $user) {
            $roles = $user->roles
                ->map(fn ($role) => strtolower((string) $role->name))
                ->unique()
                ->values();

            if ($roles->count() <= 1) {
                continue;
            }

            $roleUtama = $roles->sortBy(fn ($role) => array_search($role, $prioritasRole, true) === false ? 99 : array_search($role, $prioritasRole, true))->first();
            $rolesLain = $roles->reject(fn ($role) => $role === $roleUtama)->values();

            $this->info("User: {$user->email} | role utama: {$roleUtama} | role ganda: " . $rolesLain->implode(', '));

            if ($this->option('dry-run')) {
                $totalDibersihkan += $rolesLain->count();
                continue;
            }

            $user->syncRoles([$roleUtama]);
            $totalDibersihkan += $rolesLain->count();
        }

        if ($this->option('dry-run')) {
            $this->warn("Preview: {$totalDibersihkan} role akan dihapus dari user yang memiliki lebih dari 1 role.");
            return self::SUCCESS;
        }

        $this->info("Selesai. {$totalDibersihkan} role ganda dibersihkan.");

        return self::SUCCESS;
    }
}
