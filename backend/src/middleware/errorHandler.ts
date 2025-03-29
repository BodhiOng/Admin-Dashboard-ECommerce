// src/middleware/errorHandler.ts
import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    // Check if we have field-specific errors
    if (err.errors) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation Error',
          type: 'ValidationError',
          errors: err.errors
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: {
          message: err.message,
          type: 'ValidationError'
        }
      });
    }
    return;
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern)[0];
    res.status(409).json({
      success: false,
      error: {
        message: 'Duplicate Entry',
        type: 'DuplicateEntryError',
        details: `${duplicateField} already exists`
      },
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Handle cast errors (invalid ID format)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid ID format',
        type: 'CastError',
        details: `Invalid format for field: ${err.path}`
      },
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Pagination-related errors
  if (err.name === 'PaginationError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid Pagination Parameters',
        type: 'PaginationError',
        details: 'Page number or limit is out of acceptable range',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Sorting-related errors
  if (err.name === 'SortingError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid Sorting Parameters',
        type: 'SortingError',
        details: 'Requested sort field or order is not allowed',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Query parsing errors
  if (err.name === 'QueryParsingError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid Query Parameters',
        type: 'QueryParsingError',
        details: 'Unable to parse search or filter parameters',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Search-related errors
  if (err.name === 'SearchError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid Search Parameters',
        type: 'SearchError',
        details: 'Search query is too long or contains invalid characters',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Product query-related errors
  if (err.name === 'ProductQueryError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Product Query Error',
        type: 'ProductQueryError',
        details: 'Unable to process product search or filter',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Network and database connection errors
  if (err.name === 'MongoNetworkError') {
    res.status(503).json({
      success: false,
      error: {
        message: 'Database Connection Error',
        type: 'MongoNetworkError',
        details: 'Unable to connect to the database. Please try again later.',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Product-specific errors
  if (err.name === 'ProductOperationError') {
    res.status(500).json({
      success: false,
      error: {
        message: 'Product Operation Failed',
        type: 'ProductOperationError',
        details: err.message || 'An unexpected error occurred during product operation',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Authorization and permission errors
  if (err.name === 'UnauthorizedError' || err.name === 'ForbiddenError') {
    res.status(err.name === 'UnauthorizedError' ? 401 : 403).json({
      success: false,
      error: {
        message: err.name === 'UnauthorizedError' ? 'Unauthorized' : 'Forbidden',
        type: err.name,
        details: 'You do not have permission to perform this action',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // File upload and image-related errors
  if (err.name === 'FileUploadError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'File Upload Failed',
        type: 'FileUploadError',
        details: err.message || 'Unable to process the uploaded file',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Generic server error for unhandled exceptions
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal Server Error',
      type: 'UnhandledError',
      details: err.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  });
};

export default errorHandler;