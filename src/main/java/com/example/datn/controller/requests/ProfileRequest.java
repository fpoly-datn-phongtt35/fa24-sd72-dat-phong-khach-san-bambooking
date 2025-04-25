package com.example.datn.controller.requests;

import lombok.Builder;
import lombok.Getter;

public class ProfileRequest {

    @Getter
    @Builder
    public static class FullName {
        private Integer id;
        private String firstName;
        private String lastName;
    }

    @Getter
    @Builder
    public static class Email {
        private Integer id;
        private String email;
    }

    @Getter
    @Builder
    public static class PhoneNumber {
        private Integer id;
        private String phoneNumber;
    }

    @Getter
    @Builder
    public static class Gender {
        private Integer id;
        private String gender;
    }

    @Getter
    @Builder
    public static class Address {
        private Integer id;
        private String address;
    }
}
