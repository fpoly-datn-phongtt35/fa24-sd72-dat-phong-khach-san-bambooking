package com.example.datn.dto.request.employee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

public abstract class EmployeeRequests  {
    @Getter
    @Setter
    public static class EmployeeStore implements Serializable {
        @NotBlank(message ="user không được trống")
        private String username;
        @NotBlank(message ="password không được trống")
        private String password;
        @NotBlank(message ="firstName không được trống")
        private String firstName;
        @NotBlank(message ="lastName không được trống")
        private String lastName;
        @NotBlank(message ="idCard không được trống")
        @Pattern(regexp = "^\\d{12}$", message = "CMND phải là 12 chữ số")
        private String idCard;
        @NotBlank(message ="gender không được trống")
        private String gender;
        @NotNull(message = "role không được trống")
        private Integer role;
        private String email;
        @NotBlank(message ="phoneNumber không được trống")
        @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại phải là 10 chữ số")
        private String phoneNumber;
        @NotBlank(message ="address không được trống")
        private String address;

        private MultipartFile avatar;
    }

    @Getter
    @Builder
    public static class EmployeeUpdate implements Serializable{
        @NotBlank(message ="firstName không được trống")
        private String firstName;
        @NotBlank(message ="lastName không được trống")
        private String lastName;
        @NotBlank(message ="gender không được trống")
        private String gender;
        @NotNull(message = "role không được trống")
        private Integer role;
        @NotBlank(message ="phoneNumber không được trống")
        private String phoneNumber;
        private String email;
        @NotBlank(message ="address không được trống")
        private String address;

        private MultipartFile avatar;
    }
}
