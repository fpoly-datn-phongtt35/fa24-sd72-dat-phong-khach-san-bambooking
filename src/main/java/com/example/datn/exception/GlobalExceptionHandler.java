package com.example.datn.exception;

import com.example.datn.dto.response.ExceptionResponse;
import jakarta.persistence.EntityExistsException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j(topic = "HANDLE-EXCEPTION")
//@ControllerAdvice
@RestControllerAdvice
public class GlobalExceptionHandler {
//    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

//    // Xử lý các ngoại lệ runtime
//    @ExceptionHandler(value = RuntimeException.class)
//    public ResponseEntity<Map<String, String>> handlingRuntimeException(RuntimeException exception) {
//        // Ghi lại thông tin chi tiết về lỗi runtime
//        logger.error("Runtime Exception: ", exception);
//
//        // Chuẩn bị phản hồi lỗi dưới dạng JSON
//        Map<String, String> errorResponse = new HashMap<>();
//        errorResponse.put("message", exception.getMessage()); // Gán thông báo lỗi vào response
//
//        // Trả về phản hồi lỗi với mã HTTP 400 (Bad Request)
//        return ResponseEntity.badRequest().body(errorResponse);
//    }
//
//    // Xử lý các ngoại lệ liên quan đến validate
//    @ExceptionHandler(value = MethodArgumentNotValidException.class)
//    public ResponseEntity<Map<String, String>> handlingValidation(MethodArgumentNotValidException exception) {
//        // Ghi lại thông tin chi tiết về lỗi xác thực
//        logger.error("Validation Error: ", exception);
//
//        // Thu thập các lỗi xác thực theo trường dữ liệu (Trường -> Thông báo lỗi)
//        Map<String, String> errors = exception.getBindingResult().getFieldErrors().stream()
//                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
//
//        // Trả về các lỗi xác thực với mã HTTP 400 (Bad Request)
//        return ResponseEntity.badRequest().body(errors);
//    }


    /// //////////////
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
