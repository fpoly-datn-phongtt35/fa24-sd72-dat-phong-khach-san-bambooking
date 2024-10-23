package com.example.datn.dto.request;

import com.example.datn.model.DatPhong;
import com.example.datn.model.Phong;
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
public class TTDPRequest {
    private Integer id;
    private DatPhong datPhong;
    private Phong phong;
    private String maThongTinDatPhong;
    private LocalDateTime ngayNhanPhong;
    private LocalDateTime ngayTraPhong;
    private Double giaDat;
    private Integer soNguoi;
    private String trangThai;
}
