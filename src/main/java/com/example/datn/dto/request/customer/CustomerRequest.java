package com.example.datn.dto.request.customer;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class CustomerRequest implements Serializable {
    @NotBlank(message ="User không được trống")
    private String username;
    @NotBlank(message ="password không được trống")
    private String password;
    @NotBlank(message ="firstName không được trống")
    private String firstName;
    @NotBlank(message ="lastName không được trống")
    private String lastName;
    @NotBlank(message ="idCard không được trống")
    private String idCard;
    @NotBlank(message ="gender không được trống")
    private String gender;

    private String email;
    @NotBlank(message ="phoneNumber không được trống")
    private String phoneNumber;
    @NotBlank(message ="address không được trống")
    private String address;
}
