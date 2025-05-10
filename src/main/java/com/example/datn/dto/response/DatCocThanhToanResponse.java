package com.example.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DatCocThanhToanResponse {
    private Integer id;
    private Integer idDatPhong;
    private LocalDateTime ngayThanhToan;
    private Double tienThanhToan;
    private Boolean phuongThucThanhToan; // 0:Tien mat, 1: Payos
    private String paymentLinkId;
    private String loaiThanhToan;
    private Boolean trangThai; //0: Pending, 1: Success
    private String checkoutUrl; //URL thanh toan tu PayOS (neu co)

}
