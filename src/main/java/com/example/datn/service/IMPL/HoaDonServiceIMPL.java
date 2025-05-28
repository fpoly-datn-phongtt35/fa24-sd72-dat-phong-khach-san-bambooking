package com.example.datn.service.IMPL;

import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.mapper.HoaDonMapper;
import com.example.datn.model.DatPhong;
import com.example.datn.model.HoaDon;
import com.example.datn.model.NhanVien;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.service.HoaDonService;
import com.example.datn.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import static com.example.datn.common.TokenType.ACCESS_TOKEN;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class HoaDonServiceIMPL implements HoaDonService {
    HoaDonRepository hoaDonRepository;
    HoaDonMapper hoaDonMapper;
    DatPhongRepository datPhongRepository;
    NhanVienRepository nhanVienRepository;
    JwtService jwtService;

    private static final String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int code_length = 6;
    private final SecureRandom random = new SecureRandom();

    @Override
    public Page<HoaDonResponse> getHoaDonByTrangThai(String trangThai, String keyword, Pageable pageable) {
        Page<HoaDon> hoaDons;
        if (trangThai == null || trangThai.isEmpty()) {
            hoaDons = hoaDonRepository.findAllByOrderByNgayTaoDesc(pageable);
        } else {
            hoaDons = hoaDonRepository.findByTrangThai(trangThai, keyword, pageable);
        }
        return hoaDons.map(hoaDonMapper::toHoaDonResponse);
    }

    //Sinh mã hóa đơn 6 ký tự
    private String generateMaaHoaDon() {
        StringBuilder stringBuilder = new StringBuilder(code_length);
        for (int i = 0; i < code_length; i++) {
            int index = random.nextInt(characters.length());
            stringBuilder.append(characters.charAt(index));
        }
        return stringBuilder.toString();
    }

    //Kiểm tra xem mã hóa đơn tồn tại hay chưa
    private boolean isMaHoaDonExists(String maHoaDon) {
        return hoaDonRepository.existsByMaHoaDon(maHoaDon);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public HoaDon createHoaDon(HttpServletRequest request, Integer idTraPhong) {

        Integer idDatPhong = datPhongRepository.findIdDatPhongByIdTraPhong(idTraPhong);
        if (idDatPhong == null) {
            throw new EntityNotFountException("Không tìm thấy đặt phòng từ idTraPhong: " + idTraPhong);
        }
        DatPhong datPhong = datPhongRepository.findById(idDatPhong)
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy đặt phòng với ID: " + idDatPhong));

        // Check trùng mã hóa đơn
        String maHoaDon;

        do {
            maHoaDon = generateMaaHoaDon();
        } while (isMaHoaDonExists(maHoaDon));

        String username = this.jwtService.extractUsername(request.getHeader(HttpHeaders.AUTHORIZATION).substring("Bearer ".length()), ACCESS_TOKEN); // Boc tach token => username
        log.info("Username {}", username);
        NhanVien nhanVien = this.nhanVienRepository.findByUsername(username).orElseThrow(() -> new EntityNotFountException("User name not found!!"));

        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHoaDon(maHoaDon);
        hoaDon.setNhanVien(nhanVien);
        hoaDon.setDatPhong(datPhong);
        hoaDon.setTongTien(0.0);
        hoaDon.setNgayTao(LocalDateTime.now());
        hoaDon.setTrangThai("Chưa thanh toán");

        return hoaDonRepository.save(hoaDon);
    }

    @Override
    public HoaDonResponse getOneHoaDon(Integer idHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn có ID: " + idHoaDon));
        return hoaDonMapper.toHoaDonResponse(hoaDon);
    }
}
