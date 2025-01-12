package com.example.datn.dto.response.customer;

import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Getter
@Builder
public class BaseCustomerResponse implements Serializable {
    private long totalPage;
    private long pageSize; // Optional
    private int pageNo;
    private Object data;
}
