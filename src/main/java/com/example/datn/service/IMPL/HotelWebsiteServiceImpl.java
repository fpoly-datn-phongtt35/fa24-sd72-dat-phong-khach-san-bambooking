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
        ttdp.setDatPhong(request.getDatPhong());
        ttdp.setLoaiPhong(lp);
        ttdp.setMaThongTinDatPhong(code.generateUniqueCodeTTDP(thongTinDatPhongRepository.findAll()));
        ttdp.setGiaDat(request.getGiaDat());
        ttdp.setNgayNhanPhong(request.getNgayNhanPhong());
        ttdp.setNgayTraPhong(request.getNgayTraPhong());
        ttdp.setSoNguoi(request.getSoNguoi());
        ttdp.setTrangThai(request.getTrangThai());
        ttdp.setGhiChu(request.getGhiChu());
        // Lưu Thông Tin Đặt Phòng
        ThongTinDatPhong savedTTDP = thongTinDatPhongRepository.save(ttdp);

        // Sau khi lưu, bạn có thể lấy thông tin phòng từ savedTTDP
        String loaiPhong = savedTTDP.getLoaiPhong().getTenLoaiPhong();
        Double giaDat = savedTTDP.getGiaDat();
        LocalDateTime ngayNhanPhong = savedTTDP.getNgayNhanPhong().atStartOfDay(); // Chuyển LocalDate thành LocalDateTime
        LocalDateTime ngayTraPhong = savedTTDP.getNgayTraPhong().atStartOfDay(); // Chuyển LocalDate thành LocalDateTime

        // Gửi email chúc mừng với thông tin phòng
        new Thread(() -> {
            try {
                String fullName = savedTTDP.getDatPhong().getKhachHang().getHo() + " " + savedTTDP.getDatPhong().getKhachHang().getTen();
                emailService.sendThankYouEmail(
                        savedTTDP.getDatPhong().getKhachHang().getEmail(),
                        fullName,
                        loaiPhong,
                        giaDat,
                        ngayNhanPhong,
                        ngayTraPhong
                );
            } catch (Exception e) {
                System.err.println("Lỗi khi gửi email: " + e.getMessage());
            }
        }).start();

        return savedTTDP;

    }
}
