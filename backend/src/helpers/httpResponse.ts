export interface HttpResponse<T> {
  success: boolean
  statusCode: number
  body: T
}

export const ok = <T>(body: T): HttpResponse<T> => ({
  success: true,
  statusCode: 200,
  body,
})

export const notFound = (message: string): HttpResponse<string> => ({
  success: false,
  statusCode: 404,
  body: message,
})

export const serverError = (error: unknown): HttpResponse<string> => {
  console.error(error)
  const errorMessage =
    error instanceof Error ? error.message : 'An unexpected error occurred.'

  return {
    success: false,
    statusCode: 500,
    body: errorMessage,
  }
}
