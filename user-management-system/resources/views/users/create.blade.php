<!DOCTYPE html>
<html>
<head>
    <title>Register User</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h3>Register New User</h3>
                    </div>
                    <div class="card-body">
                        @if($errors->any())
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif
                        
                        <form action="{{ url('/users') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            
                            <div class="mb-3">
                                <label>Name *</label>
                                <input type="text" name="name" class="form-control" required>
                            </div>
                            
                            <div class="mb-3">
                                <label>Email *</label>
                                <input type="email" name="email" class="form-control" required>
                            </div>
                            
                            <div class="mb-3">
                                <label>CNIC *</label>
                                <input type="text" name="cnic" class="form-control" required>
                            </div>
                            
                            <div class="mb-3">
                                <label>Telephone *</label>
                                <input type="text" name="telephone" class="form-control" required>
                            </div>
                            
                            <div class="mb-3">
                                <label>Comments</label>
                                <textarea name="comments" class="form-control" rows="3"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label>Profile Picture</label>
                                <input type="file" name="profile_picture" class="form-control" accept="image/*">
                            </div>
                            
                            <button type="submit" class="btn btn-primary">Register</button>
                            <a href="{{ url('/users') }}" class="btn btn-secondary">Cancel</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>