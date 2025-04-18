<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware("permission:user index", only: ['index']),
            new Middleware('permission:user create', only: ['create', 'store']),
            new Middleware('permission:user edit', only: ['edit', 'update']),
            new Middleware('permission:user delete', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = User::select('name', 'id', 'email')
        ->when($request->search, fn($search) => $search->where('name', 'like', '%' . $request->search . '%'))
        ->with('roles')
        ->latest()
        ->paginate(10)->withQueryString();

        return inertia('Users/Index', ['users' => $user, 'filters' => $request->only((['search']))]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:4'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $user->assignRole(Role::find(2));

        return redirect()->route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$id}",
            'password' => 'nullable|min:4'
        ]);

        $user = User::findOrFail(intval($id));
        if($user) {
            $user->name = $request->name;
            $user->email = $request->email;
            if($request->password) {
                $user->password = Hash::make($request->password);
            }
            $user->save();
        }

        return redirect()->route('users.index')->with('success','User Updated Succesfuly');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail(intval($id));
        $user->delete();

        return redirect()->route('users.index')->with('success','User Deleted Succesfuly');
    }
}
