package com.example.datn.service.IMPL;

import com.example.datn.dto.request.HoaDonRequest;
import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.mapper.HoaDonMapper;
import com.example.datn.model.HoaDon;
import com.example.datn.model.NhanVien;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.service.HoaDonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class HoaDonServiceIMPL implements HoaDonService {
    HoaDonRepository hoaDonRepository;
    HoaDonMapper hoaDonMapper;

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
    public HoaDonResponse createHoaDon(HoaDonRequest request) {
        // Check trùng mã hóa đơn
        String maHoaDon;

        do {
            maHoaDon = generateMaaHoaDon();
        } while (isMaHoaDonExists(maHoaDon));

        NhanVien nhanVien = hoaDonRepository.searchTenDangNhap(request.getTenDangNhap());
        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHoaDon(maHoaDon);
        hoaDon.setNhanVien(nhanVien);
        hoaDon.setDatPhong(null);
        hoaDon.setTongTien(0.0);
        hoaDon.setNgayTao(LocalDateTime.now());
        hoaDon.setTrangThai("Chưa thanh toán");
        double tongTien = hoaDon.getTongTien();
        String formattedTongTien = formatCurrency(tongTien);

        HoaDonResponse hoaDonResponse = hoaDonMapper.toHoaDonResponse(hoaDonRepository.save(hoaDon));
        hoaDonResponse.setTongTien(Double.valueOf(formattedTongTien));

        return hoaDonResponse;
    }

    @Override
    public HoaDonResponse getOneHoaDon(Integer idHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(()-> new RuntimeException("Không tìm thấy hóa đơn có ID: " + idHoaDon));
        return hoaDonMapper.toHoaDonResponse(hoaDon);
    }

    @Override
    public String changeStatusHoaDon(Integer id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn có ID: " + id));

        if ("Chờ xác nhận".equals(hoaDon.getTrangThai())) {
            hoaDon.setTrangThai("Đã thanh toán");
            hoaDonRepository.save(hoaDon);
            return "Hóa đơn đã được thanh toán thành công.";
        } else {
            throw new RuntimeException("Hóa đơn không ở trạng thái 'Chờ xác nhận', không thể thay đổi.");
        }
    }

    @Override
    public NhanVien searchNhanVienByTenDangNhap(String tenDangNhap) {
        return hoaDonRepository.searchTenDangNhap(tenDangNhap);
    }

    // Phương thức định dạng tiền tệ
    private String formatCurrency(double amount) {
        NumberFormat currencyFormatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        return currencyFormatter.format(amount);
    }
}
