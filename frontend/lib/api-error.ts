import { NextResponse } from "next/server";

interface ApiErrorResponse {
  error: string;
  status: number;
  details?: unknown;
}

/**
 * Create a standardized error response.
 */
export function apiError(message: string, status: number, details?: unknown): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { error: message, status, details: details || undefined },
    { status },
  );
}

/**
 * Create a 400 Bad Request response.
 */
export function badRequest(message = "Bad request", details?: unknown) {
  return apiError(message, 400, details);
}

/**
 * Create a 401 Unauthorized response.
 */
export function unauthorized(message = "Unauthorized") {
  return apiError(message, 401);
}

/**
 * Create a 404 Not Found response.
 */
export function notFound(message = "Resource not found") {
  return apiError(message, 404);
}

/**
 * Create a 500 Internal Server Error response.
 */
export function serverError(message = "Internal server error") {
  return apiError(message, 500);
}
