<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $subcategory = Subcategory::orderBy("created_at","desc")
        ->when($request->search, fn($query) =>
            $query->where('name', 'like', '%' . $request->search . '%'))
        ->paginate(10);

        return inertia('Subcategories/Index', [
            'subcategories' => $subcategory,
            'filters'=> $request->only(['search']),
        ]);
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
            'name'=> 'required|string|max:20',
            'category' => 'required|string|in:Makanan,Minuman',
        ]);

        Subcategory::create([
            'name'=> $request->name,
            'category'=> $request->category,
        ]);

        return redirect()->route('subcategories.index');
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
    public function update(Request $request, Subcategory $subcategory)
    {
        $request->validate([
            'name'=> 'required|string|max:20',
            'category' => 'required|string|in:Makanan,Minuman',
        ]);

        $subcategory->update([
            'name'=> $request->name,
            'category'=> $request->category,
        ]);

        return redirect()->route('subcategories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();
        return redirect()->route('subcategories.index')->with('success','Subcategory Deleted Success');
    }
}
