/**
 * Custom error classes for Session Service
 */

export class SessionNotFoundError extends Error {
  constructor(message = 'Session not found') {
    super(message);
    this.name = 'SessionNotFoundError';
  }
}

export class CourseNotFoundError extends Error {
  constructor(message = 'Course not found') {
    super(message);
    this.name = 'CourseNotFoundError';
  }
}
