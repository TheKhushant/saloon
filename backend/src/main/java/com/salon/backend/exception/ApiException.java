package com.salon.backend.exception;

import org.springframework.http.HttpStatus;

// General-purpose exception carrying an HTTP status, so controllers/services
// can throw a specific status without a try/catch at every call site - a
// single @RestControllerAdvice converts these to JSON responses.
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
