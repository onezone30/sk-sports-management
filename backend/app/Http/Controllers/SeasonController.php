<?php

namespace App\Http\Controllers;

use App\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    public function index()
    {
        $season = Season::all();

        return response()->json($season, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'chairman_id' => 'required|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|boolean',
        ]);

        $season = Season::create($validatedData);

        return response()->json($season, 201);
    }

    public function show(string $id)
    {
        $season = Season::find($id);

        if (!$season) {
            return response()->json(['message' => 'Season not found'], 404);
        }

        return response()->json($season, 200);
    }   

    public function update(Request $request, string $id)
    {
        $season = Season::find($id);

        if (!$season) {
            return response()->json(['message' => 'Season not found'], 404);
        }

        $validatedData = $request->validate([
            'chairman_id' => 'sometimes|required|integer|exists:users,id',
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'status' => 'sometimes|required|boolean',
        ]);

        $season->update($validatedData);

        return response()->json($season, 200);
    }

    public function destroy(string $id)
    {
        $season = Season::find($id);

        if (!$season) {
            return response()->json(['message' => 'Season not found'], 404);
        }

        $season->delete();

        return response()->json(['message' => 'Season deleted successfully'], 200);
    }
}
