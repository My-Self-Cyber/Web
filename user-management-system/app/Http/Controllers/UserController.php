<?php

namespace App\Http\Controllers;

use App\Models\UserRegistration;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = UserRegistration::all();
        return view('users.index', compact('users'));
    }

    public function create()
    {
        return view('users.create');
    }

    public function store(Request $request)
    {
        $user = UserRegistration::create([
            'name' => $request->name,
            'email' => $request->email,
            'cnic' => $request->cnic,
            'telephone' => $request->telephone,
            'comments' => $request->comments,
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $user->profile_picture = $filename;
            $user->save();
        }

        return redirect()->route('users.index')->with('success', 'User created successfully!');
    }

    public function edit($id)
    {
        $user = UserRegistration::findOrFail($id);
        return view('users.edit', compact('user'));
    }

    public function update(Request $request, $id)
    {
        $user = UserRegistration::findOrFail($id);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'cnic' => $request->cnic,
            'telephone' => $request->telephone,
            'comments' => $request->comments,
        ]);
        
        if ($request->hasFile('profile_picture')) {
            // Delete old image if exists
            if ($user->profile_picture && file_exists(public_path('uploads/' . $user->profile_picture))) {
                unlink(public_path('uploads/' . $user->profile_picture));
            }
            
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $user->profile_picture = $filename;
            $user->save();
        }
        
        return redirect()->route('users.index')->with('success', 'User updated successfully!');
    }

    public function destroy($id)
    {
        $user = UserRegistration::findOrFail($id);
        
        // Delete profile picture if exists
        if ($user->profile_picture && file_exists(public_path('uploads/' . $user->profile_picture))) {
            unlink(public_path('uploads/' . $user->profile_picture));
        }
        
        $user->delete();
        
        return redirect()->route('users.index')->with('success', 'User deleted successfully!');
    }
    
    public function search(Request $request)
    {
        $users = UserRegistration::where('email', 'like', '%' . $request->email . '%')->get();
        return view('users.index', compact('users'));
    }
}