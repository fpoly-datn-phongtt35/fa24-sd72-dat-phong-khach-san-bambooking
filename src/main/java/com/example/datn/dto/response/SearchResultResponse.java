package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SearchResultResponse {
    private Page<LoaiPhongKhaDungResponse> danhSachLoaiPhong;
    private List<ChiaPhongResponse> danhSachCachChia;
}
