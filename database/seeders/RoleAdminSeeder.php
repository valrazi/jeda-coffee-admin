<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionAdmin = Permission::whereBetween('id', [13, 16])->get();
        $permission = Permission::get();

        $roleAdmin = Role::find(2);
        $role = Role::find(1);


        $role->syncPermissions($permission);
        $roleAdmin->syncPermissions($permissionAdmin);
    }
}
