package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SearchResultResponse {
    private LoaiPhongResponse loaiPhongResponse;
    private ChiaPhongResponse danhSachCachChia;
}
