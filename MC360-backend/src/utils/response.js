/**
 * Standardized API Response Helpers
 */

export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  })
}

export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success:   false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  })
}

export const sendCreated = (res, data, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201)
}

export const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404)
}

export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, message, 401)
}

export const sendForbidden = (res, message = 'Access denied') => {
  return sendError(res, message, 403)
}

export const sendBadRequest = (res, message = 'Bad request', errors = null) => {
  return sendError(res, message, 400, errors)
}

export const sendValidationError = (res, errors) => {
  return res.status(422).json({
    success:   false,
    message:   'Validation failed',
    errors,
    timestamp: new Date().toISOString(),
  })
}