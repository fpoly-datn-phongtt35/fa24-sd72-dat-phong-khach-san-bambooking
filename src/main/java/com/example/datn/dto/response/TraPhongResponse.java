package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TraPhongResponse {
    Integer id;
    Integer idXepPhong;
    LocalDate ngayTraThucTe;
    Boolean trangThai;
}
