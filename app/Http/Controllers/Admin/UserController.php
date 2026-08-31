<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Tampilkan daftar user.
     */
    public function index()
    {
        $daftarUser = User::with('roles')->latest()->paginate(10);
        $daftarRole = Role::pluck('name');

        return Inertia::render('Admin/Users/Index', [
            'users' => UserResource::collection($daftarUser),
            'roles' => $daftarRole,
        ]);
    }

    /**
     * Simpan user baru beserta role.
     */
    public function store(StoreUserRequest $request)
    {
        try {
            $dataValid = $request->validated();

            $userBaru = User::create([
                'name' => $dataValid['name'],
                'email' => $dataValid['email'],
                'password' => Hash::make($dataValid['password']),
            ]);

            $userBaru->syncRoles([$dataValid['role']]);

            return back()->with('sukses', 'Pengguna berhasil ditambahkan.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menambahkan pengguna. Silakan coba lagi.');
        }
    }

    /**
     * Update data user dan role.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $dataValid = $request->validated();

            $dataUpdate = [
                'name' => $dataValid['name'],
                'email' => $dataValid['email'],
            ];

            if (! empty($dataValid['password'])) {
                $dataUpdate['password'] = Hash::make($dataValid['password']);
            }

            $user->update($dataUpdate);
            $user->syncRoles([$dataValid['role']]);

            return back()->with('sukses', 'Pengguna berhasil diperbarui.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal memperbarui pengguna. Silakan coba lagi.');
        }
    }

    /**
     * Hapus user.
     */
    public function destroy(User $user)
    {
        try {
            if ($user->id === auth()->id()) {
                return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
            }

            $user->delete();

            return back()->with('sukses', 'Pengguna berhasil dihapus.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal menghapus pengguna. Silakan coba lagi.');
        }
    }
}
