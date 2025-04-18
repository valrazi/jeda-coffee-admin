<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\Middleware;

use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware('permission:products index', only: ['index']),
            new Middleware('permission:products create', only: ['create', 'store']),
            new Middleware('permission:products edit', only: ['edit', 'update']),
            new Middleware('permission:products delete', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::with('subcategory')->orderBy('created_at', 'desc')
            ->when($request->search, fn($query) =>
            $query->where('name', 'like', '%' . $request->search . '%'))
            ->when($request->category && in_array($request->category, ['Makanan', 'Minuman']), fn($query) =>
            $query->where('category', $request->category))
            ->paginate(10);

        $subcategory = Subcategory::orderBy('name','asc')->get();
        return inertia('Products/Index', [
            'products' => $products,
            'subcategories' => $subcategory,
            'filters' => $request->only(['search', 'category']),
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
            'name' => 'required|string|max:50',
            'price' => 'required|numeric|min:0|not_in:0',
            'image' => 'required|file|mimes:jpg,jpeg,png|max:2048', // Validate image file
            'category' => 'required|string|in:Makanan,Minuman',
            'description' => 'nullable|string',
            'stock' => 'required|numeric|min:0',
            'subcategory' => 'nullable'
        ]);

        // Store image in local storage (public disk)
        $path = $request->file('image')->store('products', 'public');

        $payload = [
            'name' => $request->name,
            'price' => $request->price,
            'image' => Storage::url($path), // Generate public URL
            'category' => $request->category,
            'description' => $request->description,
            'stock' => $request->stock,
        ];
        if($request->subcategory != 'undefined') {
            $payload['subcategory_id'] = $request->subcategory;
        }
        // Create product
        Product::create($payload);

        return redirect()->route('products.index');
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
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'price' => 'required|numeric|min:0|not_in:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'required|string|in:Makanan,Minuman',
            'description' => 'nullable|string',
            'stock' => 'nullable|numeric|min:0',
            'subcategory' => 'nullable'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            Storage::disk('public')->delete($product->image);
            $imagePath = $request->file('image')->store('products', 'public');
            $imagePath = Storage::url($imagePath);
        } else {
            $imagePath = $product->image;
        }

        $updateColumn = [
            'name' => $request->name,
            'price' => $request->price,
            'image' => $imagePath,
            'category' => $request->category,
            'description' => $request->description,
            'stock' => $request->stock,
        ];
        if($request->subcategory != 'null') {
            $updateColumn['subcategory_id'] = $request->subcategory;
        }
        $product->update($updateColumn);
        return redirect()->route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product Deleted Success');
    }
}
