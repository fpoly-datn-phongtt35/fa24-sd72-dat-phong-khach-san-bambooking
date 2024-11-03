package com.example.datn.dto.request;

import com.example.datn.model.Phong;
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
public class XepPhongRequest {
    private Integer id;
    private Phong phong;
    private ThongTinDatPhong thongTinDatPhong;
    private LocalDateTime ngayNhanPhong;
    private LocalDateTime ngayTraPhong;
    private Boolean trangThai;
}
