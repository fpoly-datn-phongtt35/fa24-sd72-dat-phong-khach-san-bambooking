package com.example.datn.mapper;

import com.example.datn.dto.response.ThanhToanResponse;
import com.example.datn.model.HoaDon;
import com.example.datn.model.NhanVien;
import com.example.datn.model.ThanhToan;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class ThanhToanMapper {
    public ThanhToan toThanhToan(NhanVien nhanVien, HoaDon hoaDon) {
        ThanhToan thanhToan = new ThanhToan();
        thanhToan.setNhanVien(nhanVien);
        thanhToan.setHoaDon(hoaDon);
        thanhToan.setTienThanhToan(0.0);
        thanhToan.setTienThua(0.0);
        thanhToan.setPhuongThucThanhToan(false); // false: tiền mặt, true: chuyển khoản
        thanhToan.setNgayThanhToan(LocalDateTime.now());
        thanhToan.setTrangThai(false); // false: chưa xác nhận, true: xác nhận
        return thanhToan;
    }

    public ThanhToanResponse toThanhToanResponse(ThanhToan thanhToan) {
        ThanhToanResponse response = new ThanhToanResponse();
        response.setId(thanhToan.getId());
        response.setTenNhanVien(
                thanhToan.getNhanVien() != null ? thanhToan.getNhanVien().getHoTenNhanVien() : "Không có thông tin nhân viên"
        );
        response.setMaHoaDon(
                thanhToan.getHoaDon() != null ? thanhToan.getHoaDon().getMaHoaDon() : "Không có thông tin hóa đơn"
        );

        // Trả về LocalDateTime hoặc chuỗi định dạng
        LocalDateTime ngayThanhToan = thanhToan.getNgayThanhToan();
        if (ngayThanhToan != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            response.setNgayThanhToan((ngayThanhToan.format(formatter)));
        }

        response.setTongTien(thanhToan.getHoaDon() != null ? thanhToan.getHoaDon().getTongTien() : 0.0);
        response.setTienThanhToan(thanhToan.getTienThanhToan());
        response.setTienThua(thanhToan.getTienThua());
        response.setPhuongThucThanhToan(thanhToan.getPhuongThucThanhToan() ? "Chuyển khoản" : "Tiền mặt");
        response.setTrangThai(thanhToan.getTrangThai() ? "Đã thanh toán" : "Chưa thanh toán");
        return response;
    }
}
