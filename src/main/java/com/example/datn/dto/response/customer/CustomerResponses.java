package com.example.datn.dto.response.customer;

import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

public abstract class CustomerResponses {

    @Getter
    @Builder
    public static class CustomerTemplate implements Serializable {
        private long totalPage;
        private long pageSize;
        private int pageNo;
        private Object data;
    }

    @Getter
    @Builder
    public static class CustomerData implements Serializable {
        private int id;
        private String username;
        private String fullName;
        private String gender;
        private String phoneNumber;
        private boolean isLocked;
    }

    @Getter
    @Builder
    public static class CustomerResponseBase implements Serializable {
        private Integer id;
        private String username;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String address;
        private String idCard;
        private String gender;
    }
}
