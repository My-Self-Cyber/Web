@extends('layouts.app')

@section('content')
    <h1>📝 My To-Do List</h1>
    <a href="{{ route('tasks.create') }}" class="btn btn-primary mb-3">+ Add New Task</a>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <ul class="list-group">
        @foreach($tasks as $task)
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <form action="{{ route('tasks.toggle', $task) }}" method="POST" style="display: inline;">
                        @csrf
                        @method('PATCH')
                        <button type="submit" class="btn btn-sm {{ $task->is_completed ? 'btn-success' : 'btn-secondary' }}">
                            {{ $task->is_completed ? '✓' : '○' }}
                        </button>
                    </form>
                    <span class="{{ $task->is_completed ? 'text-decoration-line-through' : '' }} ms-2">
                        {{ $task->title }}
                    </span>
                    @if($task->description)
                        <small class="text-muted ms-2">- {{ $task->description }}</small>
                    @endif
                </div>
                <div>
                    <a href="{{ route('tasks.edit', $task) }}" class="btn btn-sm btn-warning">Edit</a>
                    <form action="{{ route('tasks.destroy', $task) }}" method="POST" style="display: inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Delete this task?')">Delete</button>
                    </form>
                </div>
            </li>
        @endforeach
    </ul>
@endsection