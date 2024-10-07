package com.example.datn.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TienIchRequest {
    private Integer id;
    private String tenTienIch;
    private String hinhAnh;
}
