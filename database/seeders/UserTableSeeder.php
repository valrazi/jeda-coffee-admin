<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            "name"=> "owner",
            "email"=> "owner@jeda.com",
            "password"=> bcrypt("test"),
        ]);

        $permission = Permission::all();

        $role = Role::find(1);

        $user->assignRole($role);

        $role->syncPermissions($permission);

    }
}
