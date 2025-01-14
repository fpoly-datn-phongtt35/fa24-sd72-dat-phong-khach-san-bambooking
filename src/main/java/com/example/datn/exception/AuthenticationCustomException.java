package com.example.datn.exception;

public class AuthenticationCustomException extends RuntimeException {
    public AuthenticationCustomException(String message) {
        super(message);
    }
}
