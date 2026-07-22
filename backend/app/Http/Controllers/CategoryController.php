<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = $request->user()
            ->categories()
            ->withCount('todos')
            ->orderBy('name')
            ->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('categories', 'name')
                    ->where('user_id', $request->user()->id),
            ],
            'color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
        ]);

        $category = $request->user()
            ->categories()
            ->create($validated);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category,
        ], 201);
    }

    public function show(Request $request, Category $category): JsonResponse
    {
        $this->ensureOwner($request, $category);

        $category->loadCount('todos');

        return response()->json([
            'category' => $category,
        ]);
    }

    public function update(
        Request $request,
        Category $category
    ): JsonResponse {
        $this->ensureOwner($request, $category);

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('categories', 'name')
                    ->where('user_id', $request->user()->id)
                    ->ignore($category->id),
            ],
            'color' => [
                'sometimes',
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category->fresh()->loadCount('todos'),
        ]);
    }

    public function destroy(
        Request $request,
        Category $category
    ): JsonResponse {
        $this->ensureOwner($request, $category);

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }

    private function ensureOwner(
        Request $request,
        Category $category
    ): void {
        abort_unless(
            $category->user_id === $request->user()->id,
            403,
            'You are not allowed to access this category.'
        );
    }
}