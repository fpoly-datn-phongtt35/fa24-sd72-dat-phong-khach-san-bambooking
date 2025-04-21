package com.example.datn.controller.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProfileResponse {
    private Integer id;

    private String firstName;

    private String lastName;

    private String gender;

    private String email;

    private String phoneNumber;

    private String address;
}
