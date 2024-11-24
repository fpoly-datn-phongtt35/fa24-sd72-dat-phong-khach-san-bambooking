package com.example.datn.dto.request;

import com.example.datn.model.KhachHang;
import com.example.datn.model.XepPhong;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class KhachHangCheckinRequest {
    private Integer id;
    private XepPhong xepPhong;
    private KhachHang khachHang;
    private Boolean trangThai;
}
