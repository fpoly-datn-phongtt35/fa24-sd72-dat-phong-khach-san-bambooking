package com.example.datn.dto.request.customer;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

public abstract class CustomerRequests {

    @Getter
    @Setter
    public static class CustomerStore implements Serializable {
        @NotBlank(message ="user không được trống")
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

    @Getter
    @Builder
    public static class CustomerUpdate implements Serializable{
        @NotBlank(message ="firstName không được trống")
        private String firstName;
        @NotBlank(message ="lastName không được trống")
        private String lastName;
        @NotBlank(message ="gender không được trống")
        private String gender;
        @NotBlank(message ="phoneNumber không được trống")
        private String phoneNumber;
        private String email;
        @NotBlank(message ="address không được trống")
        private String address;
    }
}
