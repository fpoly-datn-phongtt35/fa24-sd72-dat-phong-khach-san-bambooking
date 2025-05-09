package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TraPhongResponse {
    Integer id;
    Integer idXepPhong;
    LocalDateTime ngayTraThucTe;
    Boolean trangThai;
    String tenPhong;
    LocalDateTime ngayNhan;
    String trangThaiKTP;
    LocalDateTime thoiGianKTP;
}
