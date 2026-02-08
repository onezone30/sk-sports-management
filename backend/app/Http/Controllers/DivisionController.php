<?php

namespace App\Http\Controllers;

use App\Models\Division;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $divisions = Division::all();

        return response()->json($divisions, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'sport_id' => 'integer|required',
            'min_age' => 'integer|required',
            'max_age' => 'integer|required',
            'name' => 'string|required'
        ]);

        $division = Division::create($validate);

        return response()->json($division, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $division = Division::find($id);

        if (!$division) {
            return response()->json(['message' => 'Division not found'], 404);
        }

        return response()->json($division, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $division = Division::find($id);

        if (!$division) {
            return response()->json(['message' => 'Division not found'], 404);
        }

        $validate = $request->validate([
            'sport_id' => 'integer',
            'min_age' => 'integer',
            'max_age' => 'integer',
            'name' => 'string'
        ]);

        $division->update($validate);

        return response()->json($division, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $division = Division::find($id);

        if (!$division) {
            return response()->json(['message' => 'Division not found'], 404);
        }

        $division->delete();

        return response()->json(['message' => 'Division deleted successfully'], 200);
    }
}
