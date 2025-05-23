package com.example.datn.service.IMPL;

import com.example.datn.dto.request.ThanhToanRequest;
import com.example.datn.dto.response.ThanhToanResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.mapper.ThanhToanMapper;
import com.example.datn.model.*;
import com.example.datn.repository.*;
import com.example.datn.service.JwtService;
import com.example.datn.service.ThanhToanService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    ThongTinDatPhongRepository thongTinDatPhongRepository;
    DatPhongRepository datPhongRepository;
    JwtService jwtService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ThanhToan createThanhToan(ThanhToanRequest thanhToanRequest, HttpServletRequest request) {
        String username = this.jwtService.extractUsername(request.getHeader(HttpHeaders.AUTHORIZATION).substring("Bearer ".length()), ACCESS_TOKEN); // Boc tach token => username
        Integer idNhanVien = this.nhanVienRepository.findByIdEmployee(username).orElseThrow(() -> new EntityNotFountException("User name not found!!"));

        log.info("Id Nhan Vien {}", idNhanVien);

        HoaDon hoaDon = hoaDonRepository.findById(thanhToanRequest.getIdHoaDon())
                .orElseThrow(() -> new EntityNotFountException("Hóa đơn không tồn tại"));

        NhanVien nhanVien = nhanVienRepository.findById(idNhanVien)
                .orElseThrow(() -> new EntityNotFountException("Nhân viên không tồn tại"));
        ThanhToan thanhToan = thanhToanMapper.toThanhToan(nhanVien, hoaDon);

        return thanhToanRepository.save(thanhToan);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
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

        if ("Đã thanh toán".equals(hoaDon.getTrangThai())){
            throw new RuntimeException("Hóa đơn ID " + thanhToanRequest.getIdHoaDon() + " đã được thanh toán trước đó");
        }

        if (hoaDon.getTongTien() > 0 && thanhToanRequest.getTienThanhToan() < hoaDon.getTongTien()) {
            throw new RuntimeException("Tiền thanh toán phải lớn hơn hoặc bằng tổng tiền của hóa đơn (" + hoaDon.getTongTien() + ")");
        }
        if (thanhToanRequest.getTienThanhToan() < 0) {
            throw new RuntimeException("Tiền thanh toán không được nhỏ hơn 0");
        }

        thanhToan.setNhanVien(nhanVien);
        thanhToan.setTienThanhToan(thanhToanRequest.getTienThanhToan());
        thanhToan.setTienThua(thanhToanRequest.getTienThanhToan() - hoaDon.getTongTien());
        thanhToan.setPhuongThucThanhToan(thanhToanRequest.getPhuongThucThanhToan());
        thanhToan.setTrangThai(true);
        hoaDon.setTrangThai("Đã thanh toán");

        DatPhong datPhong = hoaDon.getDatPhong();
        List<ThongTinDatPhong> thongTinDatPhongs = thongTinDatPhongRepository.findByDatPhong(datPhong);
        boolean allRoomCheckOut = thongTinDatPhongs.stream()
                .allMatch(ttdp -> "Đã trả phòng".equals(ttdp.getTrangThai()));
        if (allRoomCheckOut) {
            datPhong.setTrangThai("Đã thanh toán");
            datPhongRepository.save(datPhong);
            log.info("Đặt phòng ID {} cập nhật trạng thái 'Đã thanh toán'", datPhong.getId());
        }

        hoaDonRepository.save(hoaDon);
        thanhToanRepository.save(thanhToan);
        return thanhToanMapper.toThanhToanResponse(thanhToan);

    }
}
