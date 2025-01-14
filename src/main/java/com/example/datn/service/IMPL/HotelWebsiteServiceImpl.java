package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.KhachHang;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.service.EmailService;
import com.example.datn.service.HotelWebsiteService;
import com.example.datn.utilities.UniqueDatPhongCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class HotelWebsiteServiceImpl implements HotelWebsiteService {
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private DatPhongRepository datPhongRepository;

    @Autowired
    private ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

    @Autowired
    private EmailService emailService;

    @Override
    public KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request) {
        KhachHang khachHang = new KhachHang();
        khachHang.setTen(request.getTen());
        khachHang.setHo(request.getHo());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(false);

        KhachHang savedKhachHang = khachHangRepository.save(khachHang);
        return savedKhachHang;
    }

    @Override
    public DatPhongResponse addDatPhong(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = new DatPhong();
        DatPhongResponse datPhongResponse = new DatPhongResponse();
        UniqueDatPhongCode code = new UniqueDatPhongCode();
        String codeDP = code.generateUniqueCode(datPhongRepository.findAll());
        datPhong.setMaDatPhong(codeDP);
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setGhiChu("");
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setDatCoc(datPhongRequest.getDatCoc());
        datPhong.setNgayDat(LocalDate.now());
        datPhong.setTrangThai("Pending");
        DatPhong dp = datPhongRepository.save(datPhong);
        datPhongResponse.setId(dp.getId());
        datPhongResponse.setMaDatPhong(dp.getMaDatPhong());
        datPhongResponse.setKhachHang(dp.getKhachHang());
        datPhongResponse.setTongTien(dp.getTongTien());
        datPhongResponse.setNgayDat(dp.getNgayDat());
        datPhongResponse.setDatCoc(dp.getDatCoc());
        datPhongResponse.setGhiChu(dp.getGhiChu());
        datPhongResponse.setTrangThai(dp.getTrangThai());
        return datPhongResponse;
    }

    @Override
    public ThongTinDatPhong add(TTDPRequest request) {
        ThongTinDatPhong ttdp = new ThongTinDatPhong();
        LoaiPhong lp = loaiPhongServiceIMPL.findByID(request.getIdLoaiPhong());
        UniqueDatPhongCode code = new UniqueDatPhongCode();

        // Tính số đêm và tiền phòng
        long soDem = ChronoUnit.DAYS.between(request.getNgayNhanPhong(), request.getNgayTraPhong());
        Double tienPhong = soDem * lp.getDonGia();

        // Kiểm tra số người và tính tiền phụ thu nếu có
        long soNguoiToiDa = lp.getSoKhachToiDa();
        long soNguoi = request.getSoNguoi();
        Double tienPhuThu = 0.0;
        if (soNguoi > soNguoiToiDa) {
            tienPhuThu += (soNguoi - soNguoiToiDa) * lp.getDonGiaPhuThu();
        }

        // Cập nhật thông tin đặt phòng
        DatPhong dp = request.getDatPhong();
        dp.setTongTien(dp.getTongTien() + tienPhong + tienPhuThu);
        dp.setDatCoc(dp.getTongTien() * 0.1);

        // Thiết lập các thông tin cho ThongTinDatPhong
        ttdp.setDatPhong(dp);
        ttdp.setLoaiPhong(lp);
        ttdp.setMaThongTinDatPhong(code.generateUniqueCodeTTDP(thongTinDatPhongRepository.findAll()));
        ttdp.setGiaDat(lp.getDonGia());
        ttdp.setNgayNhanPhong(request.getNgayNhanPhong());
        ttdp.setNgayTraPhong(request.getNgayTraPhong());
        ttdp.setSoNguoi(request.getSoNguoi());
        ttdp.setTrangThai(request.getTrangThai());
        ttdp.setGhiChu(request.getGhiChu());

        // Lưu thông tin đặt phòng và thông tin chi tiết
        datPhongRepository.save(dp);
        ThongTinDatPhong savedTTDP = thongTinDatPhongRepository.save(ttdp);

        // Gửi email chúc mừng
        Double finalTienPhuThu = tienPhuThu;
        new Thread(() -> {
            try {
                String loaiPhong = savedTTDP.getLoaiPhong().getTenLoaiPhong();
                Double giaDat = savedTTDP.getGiaDat();
                String maThongTinDatPhong = savedTTDP.getMaThongTinDatPhong();
                LocalDateTime ngayNhanPhong = savedTTDP.getNgayNhanPhong().atStartOfDay();
                LocalDateTime ngayTraPhong = savedTTDP.getNgayTraPhong().atStartOfDay();
                String fullName = savedTTDP.getDatPhong().getKhachHang().getHo() + " " + savedTTDP.getDatPhong().getKhachHang().getTen();
                LocalDateTime ngayDatPhong= savedTTDP.getDatPhong().getNgayDat().atStartOfDay();

                // Thông tin thêm
                Double tongTien = dp.getTongTien();
                Double tienDatCoc = dp.getDatCoc();

                emailService.sendThankYouEmail(
                        savedTTDP.getDatPhong().getKhachHang().getEmail(),
                        fullName,
                        loaiPhong,
                        giaDat,
                        ngayNhanPhong,
                        ngayTraPhong,
                        ngayDatPhong,
                        maThongTinDatPhong,
                        soDem,
                        finalTienPhuThu,
                        tongTien,
                        tienDatCoc
                );
            } catch (Exception e) {
                System.err.println("Lỗi khi gửi email: " + e.getMessage());
            }
        }).start();

        return savedTTDP;
    }

}
