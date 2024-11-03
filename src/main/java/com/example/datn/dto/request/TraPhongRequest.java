package com.example.datn.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TraPhongRequest {
    Integer idXepPhong;
    LocalDate ngayTraThucTe;
    Boolean trangThai;
}
