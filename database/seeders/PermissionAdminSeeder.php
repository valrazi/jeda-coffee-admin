<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'products index', 'guard_name' => 'web']);
        Permission::create(['name' => 'products create', 'guard_name' => 'web']);
        Permission::create(['name' => 'products edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'products delete', 'guard_name' => 'web']);
    }
}
