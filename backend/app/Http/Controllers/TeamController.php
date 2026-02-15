<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        // Return a list of teams
        $teams = Team::all();

        return response()->json($teams, 200);
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Create a new team
        $team = Team::create($validatedData);

        return response()->json($team, 201);
    }

    public function show($id)
    {
        $team = Team::find($id);

        return response()->json($team, 200);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team = Team::find($id);
        $team->update($validatedData);

        return response()->json($team, 200);
    }

    public function destroy($id)
    {
        $team = Team::find($id);
        $team->delete();

        return response()->json(null, 204);
    }
}
