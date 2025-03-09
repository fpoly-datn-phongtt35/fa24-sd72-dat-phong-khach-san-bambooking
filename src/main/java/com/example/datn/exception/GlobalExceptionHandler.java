package com.example.datn.exception;

import com.example.datn.dto.response.ExceptionResponse;
import jakarta.persistence.EntityExistsException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@Slf4j(topic = "HANDLE-EXCEPTION")
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            MethodArgumentNotValidException.class,
            HttpMessageNotReadableException.class,
            ConstraintViolationException.class,
            EntityExistsException.class,
            AccessDeniedException.class,
            InvalidDataException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponse handleValidException(Exception ex, WebRequest request){
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(new Date());
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setPath(request.getDescription(false).replace("uri=", ""));

        String message = ex.getMessage();
        if(ex instanceof MethodArgumentNotValidException){
            int start = message.lastIndexOf("[");
            int end = message.lastIndexOf("]");
            message = message.substring(start + 1, end - 1);
            response.setError("Payload invalid");
        }else if(ex instanceof ConstraintViolationException){
            message = message.substring(message.indexOf(" ") + 1);
            response.setError("PathVariable invalid");
        }
        response.setMessage(message);
        return response;
    }

    @ExceptionHandler({
            AuthenticationCustomException.class,
            BadCredentialsException.class,
            AuthenticationException.class,
            InternalAuthenticationServiceException.class,
            DisabledException.class,
            LockedException.class,
    })
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ExceptionResponse handleBadCredentials(Exception ex, WebRequest request) {
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(new Date());
        response.setPath(request.getDescription(false).replace("uri=", ""));
        String message = ex.getMessage();

        if (ex instanceof InternalAuthenticationServiceException || ex instanceof AuthenticationCustomException) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setError("Bad credentials");
            message = "Tài khoản không tồn tại";
        } else if (ex instanceof BadCredentialsException) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setError("Bad credentials");
            message = "Mật khẩu không hợp lệ";
        } else if (ex instanceof DisabledException) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setError("Người dùng đã bị vô hiệu hóa");
        } else if (ex instanceof LockedException) {
            response.setStatus(HttpStatus.LOCKED.value());
            response.setError("Account's locked");
            response.setMessage("Người dùng đã bị khóa");
            return response;
        }
        response.setMessage(message);
        return response;
    }

}
