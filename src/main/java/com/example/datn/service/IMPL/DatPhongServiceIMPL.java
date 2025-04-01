package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.NhanVien;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.*;
import com.example.datn.service.DatPhongService;
import com.example.datn.utilities.UniqueDatPhongCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Service
public class DatPhongServiceIMPL implements DatPhongService {
    @Autowired
    DatPhongRepository datPhongRepository;

    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Autowired
    XepPhongRepository xepPhongRepository;

    @Override
    public Page<DatPhongResponse> getByTrangThai(String tt, Pageable pageable) {
        return datPhongRepository.DatPhongTheoTrangThai(tt,pageable);
    }

    @Override
    public List<DatPhong> getAll() {
        return datPhongRepository.findAll();
    }

    @Override
    public DatPhongResponse addDatPhong(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = new DatPhong();
        DatPhongResponse datPhongResponse = new DatPhongResponse();
        UniqueDatPhongCode code = new UniqueDatPhongCode();
        String codeDP = code.generateUniqueCode(datPhongRepository.findAll());
        datPhong.setMaDatPhong(codeDP);
        datPhong.setSoPhong(datPhongRequest.getSoPhong());
        datPhong.setSoNguoi(datPhongRequest.getSoNguoi());
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setGhiChu(datPhongRequest.getGhiChu());
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setNgayDat(LocalDate.now());
        datPhong.setTrangThai(datPhongRequest.getTrangThai());
        DatPhong dp = datPhongRepository.save(datPhong);


        datPhongResponse.setId(dp.getId());
        datPhongResponse.setMaDatPhong(dp.getMaDatPhong());
        datPhongResponse.setSoPhong(dp.getSoPhong());
        datPhongResponse.setSoNguoi(dp.getSoNguoi());
        datPhongResponse.setKhachHang(dp.getKhachHang());
        datPhongResponse.setTongTien(dp.getTongTien());
        datPhongResponse.setNgayDat(dp.getNgayDat());
        datPhongResponse.setGhiChu(dp.getGhiChu());
        datPhongResponse.setTrangThai(dp.getTrangThai());
        return datPhongResponse;
    }

    @Override
    public DatPhongResponse detailDatPhong(Integer id) {
        return datPhongRepository.findByIdDatPhong(id);
    }

    @Override
    public Page<DatPhongResponse> LocTheoTrangThai(List<String> trangThai,String key, Pageable pageable) {
        if (trangThai == null || trangThai.isEmpty()) {
            return datPhongRepository.findAllDP(pageable);
        } else {
            return datPhongRepository.DatPhongTheoTrangThai(trangThai,key, pageable);
        }
    }

    @Override
    public Page<DatPhongResponse> searchDatPhong(String keyword, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return datPhongRepository.searchDatPhong(keyword, startDate,endDate,pageable);
    }


    @Override
    public DatPhong updateDatPhong(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = datPhongRepository.findByMaDatPhong(datPhongRequest.getMaDatPhong());
        datPhong.setSoNguoi(datPhongRequest.getSoNguoi());
        datPhong.setSoPhong(datPhongRequest.getSoPhong());
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setGhiChu(datPhongRequest.getGhiChu());
        datPhong.setTrangThai(datPhongRequest.getTrangThai());
        return datPhongRepository.save(datPhong);
    }

    @Override
    public DatPhong findByMaDatPhong(String maDatPhong) {
        return datPhongRepository.findByMaDatPhong(maDatPhong);
    }

//    @Override
//    public Double sumTotalAmountByIDDatPhong(Integer idDP) {
//        Double tongTien = 0.0;
//        List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByDatPhongId(idDP);
//        for (ThongTinDatPhong ttdp : ttdps) {
//            LocalDate ngayNhanPhong = ttdp.getNgayNhanPhong();
//            LocalDate ngayTraPhong = ttdp.getNgayTraPhong();
//            Double giaDat = ttdp.getGiaDat();
//
//            if (ngayNhanPhong != null && ngayTraPhong != null && giaDat != null) {
//                long days = java.time.temporal.ChronoUnit.DAYS.between(ngayNhanPhong, ngayTraPhong);
//                if (days == 0) {
//                    days = 1;
//                }
//                tongTien += days * giaDat;
//            }
//        }
//        return tongTien;
//    }

    @Override
    public Page<DatPhongResponse> findAll(String keyword, Pageable pageable) {
        return datPhongRepository.findAll(keyword, pageable);
    }
    public DatPhong addDatPhongNgay(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = new DatPhong();
        UniqueDatPhongCode code = new UniqueDatPhongCode();
        String codeDP = code.generateUniqueCode(datPhongRepository.findAll());
        datPhong.setMaDatPhong(codeDP);
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setNgayDat(datPhongRequest.getNgayDat());
        datPhong.setGhiChu(datPhongRequest.getGhiChu());
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setTrangThai(datPhongRequest.getTrangThai());
        return datPhongRepository.save(datPhong);
    }

    @Override
    public Page<DatPhong> DSDatPhong(Pageable pageable) {
        return  datPhongRepository.DSDatPhong(pageable);
    }

    @Override
    public void xoaDatPhong(Integer iddp) {
        datPhongRepository.deleteById(iddp);
    }

    public  Page<DatPhongResponse> findDatPhongToCheckin(String key, int page, int size){
        List<String> trangThai = Arrays.asList("Đã xác nhận");
        Pageable pageable = PageRequest.of(page, size);
        Page<DatPhongResponse> result = datPhongRepository.DatPhongTheoTrangThai(trangThai,key,pageable);
        return result;
    }

    public Page<DatPhongResponse> findDatPhong(String key, LocalDate ngayNhanPhong, LocalDate ngayTraPhong, int page, int size) {
        List<String> trangThaiTTDP = Arrays.asList("Đã hủy","Đang đặt phòng","Đang ở","Chưa xếp", "Đã xếp", "Đã trả phòng", "Đã kiểm tra phòng");
        List<String> trangThai = Arrays.asList("Đã hủy","Đang đặt phòng", "Đã xác nhận", "Đã nhận phòng", "Đã trả phòng", "Đã thanh toán");
        Pageable pageable = PageRequest.of(page, size);
        return datPhongRepository.findDatPhong(trangThai, trangThaiTTDP, key, ngayNhanPhong, ngayTraPhong, pageable);
    }

//    public void updateTrangThaiDatPhong() {
//        LocalDateTime now = LocalDateTime.now();
//
//        for (DatPhong dp : datPhongs) {
//            List<String> trangThaiTTDPs = Arrays.asList("Chua xep", "Da xep", "Dang o");
//            List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByDatPhongId(dp.getId(),trangThaiTTDPs);
//            for(ThongTinDatPhong ttdp : ttdps) {
//                String status = "";
//                if(ttdp.getTrangThai().equalsIgnoreCase("Chua xep")){
//                    status = "Cần xếp phòng";
//                }
//            }
//
//            String currentTrangThai = dp.getTrangThai();
//            String newTrangThai = currentTrangThai;
//
//            // Logic cập nhật trạng thái
//            if ("Chua xep".equals(currentTrangThai)) {
//                if (now.isAfter(dp.getNgayNhanPhong())) {
//                    newTrangThai = "Dang o"; // Nếu đã qua giờ nhận phòng
//                }
//            } else if ("Dang o".equals(currentTrangThai)) {
//                if (now.isAfter(dp.getNgayTraPhong())) {
//                    newTrangThai = "Da tra phong"; // Nếu đã qua giờ trả phòng
//                }
//            }
//
//            // Nếu trạng thái thay đổi, cập nhật và gửi thông báo
//            if (!newTrangThai.equals(currentTrangThai)) {
//                dp.setTrangThai(newTrangThai);
//                datPhongRepository.save(dp);
//                sendTrangThaiUpdate(dp); // Gửi thông báo qua WebSocket
//            }
//        }
//    }

    public DatPhong huyDatPhong(String maDatPhong) {
        DatPhong dp = datPhongRepository.findByMaDatPhong(maDatPhong);
        dp.setTrangThai("Đã hủy");
        List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByMaDatPhong(maDatPhong);
        for(ThongTinDatPhong ttdp: ttdps){
            XepPhong xp = xepPhongRepository.getByMaTTDP(ttdp.getMaThongTinDatPhong());
            if (xp != null) {
                xp.setTrangThai("Đã hủy");
                xepPhongRepository.save(xp);
            }
            ttdp.setTrangThai("Đã hủy");
            thongTinDatPhongRepository.save(ttdp);
        }
        return datPhongRepository.findByMaDatPhong(maDatPhong);
    }
}