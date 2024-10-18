package com.example.datn.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class TienIchResponse {
    private Integer id;
    private String tenTienIch;
    private String hinhAnh;

    public TienIchResponse(Integer id,String tenTienIch,String hinhAnh){
        this.id = id;
        this.tenTienIch = tenTienIch;
        this.hinhAnh = hinhAnh;
    }
}
