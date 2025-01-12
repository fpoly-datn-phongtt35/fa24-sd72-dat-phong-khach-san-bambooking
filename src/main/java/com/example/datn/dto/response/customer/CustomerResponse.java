package com.example.datn.dto.response.customer;

import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Getter
@Builder
public class CustomerResponse implements Serializable {
    private int id;
    private String username;
    private String fullName;
    private String gender;
    private String phoneNumber;
    private boolean isLocked;
}
