<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function uploadTransferProof(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048', // Validate image format & size
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('transfer_proof', options: 'public'); // Store in storage/app/public/uploads
            return response()->json([
                'status' => 'success',
                'url' => asset("storage/{$path}") // Send the uploaded file URL
            ]);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }
}
