package com.example.datn.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KiemTraVatTuRequest {
    private Integer idVatTu;

    @NotNull(message = "Số lượng thực tế không được để trống!")
    @Min(value = 0, message = "Số lượng thực tế phải lớn hơn 0!")
    private Integer soLuongThucTe;
    private String tinhTrang;
    private String ghiChu;
}
