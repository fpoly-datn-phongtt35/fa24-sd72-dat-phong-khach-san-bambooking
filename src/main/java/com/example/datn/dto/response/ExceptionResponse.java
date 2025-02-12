package com.example.datn.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
@Getter
@Setter
@ToString
public class ExceptionResponse {
    private Date timestamp;
    private int status;
    private String path;
    private String error;
    private String message;
}
