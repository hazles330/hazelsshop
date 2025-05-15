export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): Response => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ message: 'Internal server error' }),
    { status: 500 }
  );
};
