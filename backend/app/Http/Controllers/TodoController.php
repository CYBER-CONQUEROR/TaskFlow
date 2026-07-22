<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TodoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()
            ->todos()
            ->with('category')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();

            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->string('status')->toString();

            if ($status === 'completed') {
                $query->where('completed', true);
            }

            if ($status === 'pending') {
                $query->where('completed', false);
            }
        }

        if ($request->filled('category_id')) {
            $query->where(
                'category_id',
                $request->integer('category_id')
            );
        }

        if ($request->boolean('uncategorized')) {
            $query->whereNull('category_id');
        }

        if ($request->filled('created_date')) {
            $request->validate([
                'created_date' => ['date_format:Y-m-d'],
            ]);

            $query->whereDate(
                'created_at',
                $request->string('created_date')->toString()
            );
        }

        if ($request->filled('period')) {
            $period = $request->string('period')->toString();

            if ($period === 'today') {
                $query->whereDate('created_at', today());
            }

            if ($period === 'yesterday') {
                $query->whereDate('created_at', today()->subDay());
            }

            if ($period === 'this-week') {
                $query->whereBetween('created_at', [
                    now()->startOfWeek(),
                    now()->endOfWeek(),
                ]);
            }

            if ($period === 'last-7-days') {
                $query->where('created_at', '>=', now()->subDays(6)->startOfDay());
            }

            if ($period === 'older') {
                $query->where('created_at', '<', now()->subDays(6)->startOfDay());
            }
        }

        return response()->json([
            'todos' => $query->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'completed' => ['sometimes', 'boolean'],
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')
                    ->where('user_id', $request->user()->id),
            ],
        ]);

        $todo = $request->user()
            ->todos()
            ->create($validated);

        $todo->load('category');

        return response()->json([
            'message' => 'Todo created successfully.',
            'todo' => $todo,
        ], 201);
    }

    public function show(
        Request $request,
        Todo $todo
    ): JsonResponse {
        $this->ensureOwner($request, $todo);

        return response()->json([
            'todo' => $todo->load('category'),
        ]);
    }

    public function update(
        Request $request,
        Todo $todo
    ): JsonResponse {
        $this->ensureOwner($request, $todo);

        $validated = $request->validate([
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],
            'completed' => [
                'sometimes',
                'boolean',
            ],
            'category_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('categories', 'id')
                    ->where('user_id', $request->user()->id),
            ],
        ]);

        $todo->update($validated);

        return response()->json([
            'message' => 'Todo updated successfully.',
            'todo' => $todo->fresh()->load('category'),
        ]);
    }

    public function destroy(
        Request $request,
        Todo $todo
    ): JsonResponse {
        $this->ensureOwner($request, $todo);

        $todo->delete();

        return response()->json([
            'message' => 'Todo deleted successfully.',
        ]);
    }

    private function ensureOwner(
        Request $request,
        Todo $todo
    ): void {
        abort_unless(
            $todo->user_id === $request->user()->id,
            403,
            'You are not allowed to access this todo.'
        );
    }
}