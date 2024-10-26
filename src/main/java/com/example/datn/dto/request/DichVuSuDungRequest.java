package com.example.datn.dto.request;

import com.example.datn.model.DichVu;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DichVuSuDungRequest {

    private Integer id;
    private DichVu dichVu;
    private XepPhong xepPhong;
    private Integer soLuongSuDung;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Double giaSuDung;
    private Boolean trangThai;
}
