package com.example.datn.dto.request;

import com.example.datn.model.ThongTinHoaDon;
import com.example.datn.model.XepPhong;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TraPhongRequest {
    XepPhong xepPhong;
    LocalDate ngayTraThucTe;
    Boolean trangThai;
}
