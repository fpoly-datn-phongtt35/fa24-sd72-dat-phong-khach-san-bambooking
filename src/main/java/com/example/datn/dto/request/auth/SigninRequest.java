package com.example.datn.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.validator.constraints.Length;

import java.io.Serializable;

@Builder
@Getter
public class SigninRequest implements Serializable {
    @NotBlank(message = "Username must be not blank!")
    private String username;

    @NotBlank(message = "Password must be not blank!")
    @Length(min = 3, max = 20, message = "Password invalid!!")
    private String password;
}
