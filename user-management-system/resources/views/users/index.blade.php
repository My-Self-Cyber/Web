<!DOCTYPE html>
<html>
<head>
    <title>User Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">User Management System</h1>
        
        <div class="card">
            <div class="card-header">
                <h3>User List</h3>
            </div>
            <div class="card-body">
                <?php
                use App\Models\UserRegistration;
                $users = UserRegistration::all();
                ?>
                
                @if($users->count() > 0)
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>CNIC</th>
                            <th>Telephone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $user)
                        <tr>
                            <td>{{ $user->id }}</td>
                            <td>{{ $user->name }}</td>
                            <td>{{ $user->email }}</td>
                            <td>{{ $user->cnic }}</td>
                            <td>{{ $user->telephone }}</td>
                            <td>
                                <a href="{{ url('/users/'.$user->id.'/edit') }}" class="btn btn-warning btn-sm">Edit</a>
                                <form action="{{ url('/users/'.$user->id) }}" method="POST" style="display:inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Delete this user?')">Delete</button>
                                </form>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                @else
                <div class="alert alert-info">No users found. Please register a user.</div>
                @endif
                
                <a href="{{ url('/users/create') }}" class="btn btn-primary">Register New User</a>
            </div>
        </div>
    </div>
</body>
</html>