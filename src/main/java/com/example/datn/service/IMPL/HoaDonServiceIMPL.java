package com.example.datn.service.IMPL;

import com.example.datn.dto.request.HoaDonRequest;
import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.mapper.HoaDonMapper;
import com.example.datn.model.DatPhong;
import com.example.datn.model.HoaDon;
import com.example.datn.model.NhanVien;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.service.HoaDonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class HoaDonServiceIMPL implements HoaDonService {
    HoaDonRepository hoaDonRepository;
    DatPhongRepository datPhongRepository;
    HoaDonMapper hoaDonMapper;

    private static final String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int code_length = 6;
    private final SecureRandom random = new SecureRandom();

    @Override
    public Page<HoaDonResponse> getHoaDonByTrangThai(String trangThai, String keyword, Pageable pageable) {
        Page<HoaDon> hoaDons;
        if (trangThai == null || trangThai.isEmpty()) {
            hoaDons = hoaDonRepository.findAll(pageable);
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
    public HoaDonResponse createHoaDon(HoaDonRequest request) {
        // Check trùng mã hóa đơn
        String maHoaDon;
        do {
            maHoaDon = generateMaaHoaDon();
        } while (isMaHoaDonExists(maHoaDon));

        NhanVien nhanVien = hoaDonRepository.searchTenDangNhap(request.getTenDangNhap());
        DatPhong datPhong = datPhongRepository.findById(request.getIdDatPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin đặt phòng"));

        HoaDon hoaDon = HoaDonMapper.toHoaDon(request, nhanVien, datPhong);
        hoaDon.setMaHoaDon(maHoaDon);
        return hoaDonMapper.toHoaDonResponse(hoaDonRepository.save(hoaDon));
    }


    @Override
    public void changeStatusHoaDon(Integer idHoaDon) {

    }
    @Override
    public NhanVien searchNhanVienByTenDangNhap(String tenDangNhap) {
        return hoaDonRepository.searchTenDangNhap(tenDangNhap);
    }
}
