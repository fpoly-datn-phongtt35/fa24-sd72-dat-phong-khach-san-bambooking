package com.example.datn.dto.request;

import com.example.datn.model.KhachHang;
import com.example.datn.model.ThongTinDatPhong;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DanhGiaRequest {
    private Integer id;
    private Integer idKhachHang;
    private Integer idThongTinDatPhong;
    private Integer stars;
    private String nhanXet;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String trangThai;
}
