package com.example.datn.dto.request.customer;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class FilterRequest implements Serializable {
    private String keyword;
    private Integer pageNo = 0;
    private Integer pageSize = 5;
}
