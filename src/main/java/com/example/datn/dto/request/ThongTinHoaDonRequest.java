package com.example.datn.dto.request;
import com.example.datn.model.TraPhong;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ThongTinHoaDonRequest {

    Integer idHoaDon;
    List<TraPhong> listTraPhong;
    Double tienDichVu;
    Double tienPhong;
    Double tienPhuThu;
}
