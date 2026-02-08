<?php

namespace App\Http\Controllers;

use App\Models\Sport;
use Illuminate\Http\Request;

class SportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sports = Sport::all();

        return response()->json($sports, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'season_id' => 'required|integer|exists:seasons,id',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'max_players_per_team' => 'required|integer|min:1',
            'status' => 'required|boolean',
        ]);

        $sport = Sport::create($validatedData);

        return response()->json($sport, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sport = Sport::find($id);

        if (!$sport) {
            return response()->json(['message' => 'Sport not found'], 404);
        }

        return response()->json($sport, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $sport = Sport::find($id);

        if (!$sport) {
            return response()->json(['message' => 'Sport not found'], 404);
        }

        $validatedData = $request->validate([
            'season_id' => 'sometimes|required|integer|exists:seasons,id',
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'max_players_per_team' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|required|boolean',
        ]);

        $sport->update($validatedData);

        return response()->json($sport, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sport = Sport::find($id);

        if (!$sport) {
            return response()->json(['message' => 'Sport not found'], 404);
        }

        $sport->delete();

        return response()->json(['message' => 'Sport deleted successfully'], 200);
    }
}
