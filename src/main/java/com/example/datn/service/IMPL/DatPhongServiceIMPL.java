package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.NhanVien;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.service.DatPhongService;
import com.example.datn.utilities.UniqueDatPhongCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DatPhongServiceIMPL implements DatPhongService {
    @Autowired
    DatPhongRepository datPhongRepository;

    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

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
    public DatPhongResponse detailDatPhong(Integer id) {
        return datPhongRepository.findByIdDatPhong(id);
    }

    @Override
    public Page<DatPhongResponse> LocTheoTrangThai(List<String> trangThai, Pageable pageable) {
        if (trangThai == null || trangThai.isEmpty()) {
            return datPhongRepository.findAllDP(pageable);
        } else {
            return datPhongRepository.DatPhongTheoTrangThai(trangThai, pageable);
        }
    }

    @Override
    public Page<DatPhongResponse> searchDatPhong(String keyword, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return datPhongRepository.searchDatPhong(keyword, startDate,endDate,pageable);
    }


    @Override
    public DatPhong updateDatPhong(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = new DatPhong();
        datPhong.setId(datPhongRequest.getId());
        datPhong.setMaDatPhong(datPhongRequest.getMaDatPhong());
        datPhong.setTongTien(datPhongRequest.getTongTien());
        datPhong.setDatCoc(datPhongRequest.getDatCoc());
        datPhong.setNgayDat(datPhongRequest.getNgayDat());
        datPhong.setGhiChu(datPhongRequest.getGhiChu());
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setTrangThai(datPhongRequest.getTrangThai());
        return datPhongRepository.save(datPhong);
    }

    @Override
    public DatPhong findByMaDatPhong(String maDatPhong) {
        return datPhongRepository.findByMaDatPhong(maDatPhong);
    }

    @Override
    public Double sumTotalAmountByIDDatPhong(Integer idDP) {
        Double tongTien = 0.0;
        List<ThongTinDatPhong> ttdps = thongTinDatPhongRepository.findByDatPhongId(idDP);
        for (ThongTinDatPhong ttdp : ttdps) {
            LocalDate ngayNhanPhong = ttdp.getNgayNhanPhong();
            LocalDate ngayTraPhong = ttdp.getNgayTraPhong();
            Double giaDat = ttdp.getGiaDat();

            if (ngayNhanPhong != null && ngayTraPhong != null && giaDat != null) {
                long days = java.time.temporal.ChronoUnit.DAYS.between(ngayNhanPhong, ngayTraPhong);
                if (days == 0) {
                    days = 1;
                }
                tongTien += days * giaDat;
            }
        }
        return tongTien;
    }
}
