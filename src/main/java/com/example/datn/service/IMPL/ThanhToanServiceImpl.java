package com.example.datn.service.IMPL;

import com.example.datn.dto.request.ThanhToanRequest;
import com.example.datn.dto.response.ThanhToanResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.mapper.ThanhToanMapper;
import com.example.datn.model.DatPhong;
import com.example.datn.model.HoaDon;
import com.example.datn.model.NhanVien;
import com.example.datn.model.ThanhToan;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.ThanhToanRepository;
import com.example.datn.service.JwtService;
import com.example.datn.service.ThanhToanService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.stereotype.Service;

import static com.example.datn.common.TokenType.ACCESS_TOKEN;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class ThanhToanServiceImpl implements ThanhToanService {
    ThanhToanRepository thanhToanRepository;
    ThanhToanMapper thanhToanMapper;
    NhanVienRepository nhanVienRepository;
    HoaDonRepository hoaDonRepository;
    JwtService jwtService;

    @Override
    public ThanhToan createThanhToan(ThanhToanRequest thanhToanRequest, HttpServletRequest request) {
        String username = this.jwtService.extractUsername(request.getHeader(HttpHeaders.AUTHORIZATION).substring("Bearer ".length()), ACCESS_TOKEN); // Boc tach token => username
        Integer idNhanVien = this.nhanVienRepository.findByIdEmployee(username).orElseThrow(() -> new EntityNotFountException("User name not found!!"));

        log.info("Id Nhan Vien {}", idNhanVien);

        HoaDon hoaDon = hoaDonRepository.findById(thanhToanRequest.getIdHoaDon())
                .orElseThrow(() -> new EntityNotFountException("Hóa đơn không tồn tại"));

        NhanVien nhanVien = nhanVienRepository.findById(idNhanVien)
                .orElseThrow(() -> new EntityNotFountException("Hóa đơn không tồn tại"));

        return thanhToanRepository.save(thanhToanMapper.toThanhToan(nhanVien, hoaDon));
    }

    @Override
    public ThanhToanResponse updateThanhToan(Integer id, ThanhToanRequest thanhToanRequest, HttpServletRequest request) {
        ThanhToan thanhToan = thanhToanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán với ID: " + id));
        String username = this.jwtService.extractUsername(request.getHeader(HttpHeaders.AUTHORIZATION).substring("Bearer ".length()), ACCESS_TOKEN); // Boc tach token => username
        Integer idNhanVien = this.nhanVienRepository.findByIdEmployee(username).orElseThrow(() -> new EntityNotFountException("User name not found!!"));

        HoaDon hoaDon = hoaDonRepository.findById(thanhToanRequest.getIdHoaDon())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn có ID: " + thanhToanRequest.getIdHoaDon()));

        NhanVien nhanVien = nhanVienRepository.findById(idNhanVien)
                .orElseThrow(() -> new EntityNotFountException("Hóa đơn không tồn tại"));
        System.out.println("Updating ThanhToan with ID: " + id);
        System.out.println("HoaDon ID: " + thanhToanRequest.getIdHoaDon());
        System.out.println("Tong tien hoa don: " + hoaDon.getTongTien());
        System.out.println("Tien Thanh Toan: " + thanhToanRequest.getTienThanhToan());

        if (thanhToanRequest.getTienThanhToan() < hoaDon.getTongTien()) {
            throw new RuntimeException("Tiền thanh toán phải lớn hơn hoặc bằng tổng tiền của hóa đơn");
        } else {
            DatPhong datPhong = hoaDon.getDatPhong();
            thanhToan.setNhanVien(nhanVien);
            thanhToan.setTienThanhToan(thanhToanRequest.getTienThanhToan());
            thanhToan.setTienThua(thanhToanRequest.getTienThanhToan() - hoaDon.getTongTien());
            thanhToan.setPhuongThucThanhToan(thanhToanRequest.getPhuongThucThanhToan());
            thanhToan.setTrangThai(true);

            hoaDon.setTrangThai("Chờ xác nhận");
            datPhong.setTrangThai("Đã thanh toán");
            hoaDonRepository.save(hoaDon);

            thanhToanRepository.save(thanhToan);
            return thanhToanMapper.toThanhToanResponse(thanhToan);
        }
    }
}
