package com.example.datn.service.IMPL;

import com.example.datn.dto.request.ThanhToanRequest;
import com.example.datn.dto.response.ThanhToanResponse;
import com.example.datn.mapper.ThanhToanMapper;
import com.example.datn.model.HoaDon;
import com.example.datn.model.NhanVien;
import com.example.datn.model.ThanhToan;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.ThanhToanRepository;
import com.example.datn.service.ThanhToanService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ThanhToanServiceImpl implements ThanhToanService {
    ThanhToanRepository thanhToanRepository;
    ThanhToanMapper thanhToanMapper;
    NhanVienRepository nhanVienRepository;
    HoaDonRepository hoaDonRepository;

    @Override
    public ThanhToan createThanhToan(ThanhToanRequest request) {
        NhanVien nhanVien = nhanVienRepository.findById(request.getIdNhanVien())
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));

        HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
                .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));

        return thanhToanRepository.save(thanhToanMapper.toThanhToan(request, nhanVien, hoaDon));
    }

    @Override
    public ThanhToanResponse updateThanhToan(Integer id, ThanhToanRequest request) {
        ThanhToan thanhToan = thanhToanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán với ID: " + id));
        HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn có ID: " + request.getIdHoaDon()));

        System.out.println("Updating ThanhToan with ID: " + id);
        System.out.println("HoaDon ID: " + request.getIdHoaDon());
        System.out.println("Tong tien hoa don: " + hoaDon.getTongTien());
        System.out.println("Tien Thanh Toan: " + request.getTienThanhToan());

        if (request.getTienThanhToan() < hoaDon.getTongTien()) {
            throw new RuntimeException("Tiền thanh toán phải lớn hơn hoặc bằng tổng tiền của hóa đơn");
        } else {

            thanhToan.setTienThanhToan(request.getTienThanhToan());
            thanhToan.setTienThua(request.getTienThanhToan() - hoaDon.getTongTien());
            thanhToan.setPhuongThucThanhToan(request.getPhuongThucThanhToan());
            thanhToan.setTrangThai(true);

            hoaDon.setTrangThai("Chờ xác nhận");
            hoaDonRepository.save(hoaDon);

            thanhToanRepository.save(thanhToan);
            return thanhToanMapper.toThanhToanResponse(thanhToan);
        }
    }
}
