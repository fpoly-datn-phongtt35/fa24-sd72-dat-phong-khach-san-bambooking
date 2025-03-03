package com.example.datn.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KiemTraPhongResponse {
    private Integer id;
    private Integer idXepPhong;
    private String maThongTinDatPhong;
    private String nhanVienKiemTraPhong;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime thoiGianKiemTra;
    private String tinhTrangVatTu;
    private String trangThai;

    private List<KiemTraVatTuResponse> danhSachVatTu;
}
