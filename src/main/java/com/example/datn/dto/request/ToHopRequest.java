package com.example.datn.dto.request;

import com.example.datn.dto.response.datphong.LoaiPhongChon;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ToHopRequest {
    private String ngayNhanPhong; // Nhận dưới dạng String
    private String ngayTraPhong;  // Nhận dưới dạng String

    private Integer soNguoi;
    private String key;
    private Double tongChiPhiMin;
    private Double tongChiPhiMax;
    private Integer tongSoPhongMin;
    private Integer tongSoPhongMax;
    private Integer tongSucChuaMin;
    private Integer tongSucChuaMax;
    private List<LoaiPhongChon> loaiPhongChons;
}
