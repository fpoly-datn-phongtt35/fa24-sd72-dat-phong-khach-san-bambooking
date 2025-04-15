package com.example.datn.service.IMPL;

import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.TTDPResponse;
import com.example.datn.model.*;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.service.ThongTinDatPhongService;
import com.example.datn.utilities.UniqueDatPhongCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class ThongTinDatPhongServiceIMPL implements ThongTinDatPhongService {
    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

    @Autowired
    XepPhongRepository xepPhongRepository;
    @Autowired
    DatPhongRepository datPhongRepository;

    @Autowired
    KhachHangServiceIMPL khachHangServiceIMPL;


    @Override
    public List<ThongTinDatPhong> getAll() {
        return thongTinDatPhongRepository.findAll();
    }

    @Override
    public ThongTinDatPhong add(TTDPRequest request) {
        ThongTinDatPhong ttdp = new ThongTinDatPhong();
        LoaiPhong lp = loaiPhongServiceIMPL.findByID(request.getIdLoaiPhong());
        UniqueDatPhongCode code = new UniqueDatPhongCode();
        long soDem = ChronoUnit.DAYS.between(request.getNgayNhanPhong(), request.getNgayTraPhong());
        Double tienPhong = soDem * request.getGiaDat();
        long soNguoiToiDa = lp.getSoKhachToiDa();
        long soNguoi = request.getSoNguoi();
        Double tienPhuThu = 0.0;
        if (soNguoi > soNguoiToiDa) {
            tienPhuThu += (soNguoi - soNguoiToiDa) * lp.getDonGiaPhuThu();
        }
        DatPhong dp = request.getDatPhong();
        dp.setTongTien(dp.getTongTien() + tienPhong + tienPhuThu);
        ttdp.setDatPhong(dp);
        ttdp.setLoaiPhong(lp);
        ttdp.setMaThongTinDatPhong(code.generateUniqueCodeTTDP(thongTinDatPhongRepository.findAll()));
        ttdp.setGiaDat(lp.getDonGia());
        ttdp.setNgayNhanPhong(request.getNgayNhanPhong());
        ttdp.setNgayTraPhong(request.getNgayTraPhong());
        ttdp.setSoNguoi(request.getSoNguoi());
        ttdp.setTrangThai(request.getTrangThai());
        datPhongRepository.save(dp);
        return thongTinDatPhongRepository.save(ttdp);
    }

    @Override
    public Page<ThongTinDatPhong> getAll(Pageable pageable) {
        return thongTinDatPhongRepository.findAll(pageable);
    }

    @Override
    public List<ThongTinDatPhong> getByIDDP(Integer iddp) {
        List<String> list = new ArrayList<>();
        list.add("Đang đặt phòng");
        return thongTinDatPhongRepository.findByDatPhongId(iddp,list);
    }

    @Override
    public ThongTinDatPhong update(TTDPRequest request) {
        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getReferenceById(request.getId());
        LoaiPhong lp = loaiPhongServiceIMPL.findByID(request.getIdLoaiPhong());
        ttdp.setLoaiPhong(lp);
        ttdp.setGiaDat(request.getGiaDat());
        ttdp.setNgayNhanPhong(request.getNgayNhanPhong());
        ttdp.setNgayTraPhong(request.getNgayTraPhong());
        ttdp.setSoNguoi(request.getSoNguoi());
        ttdp.setTrangThai(request.getTrangThai());
        ttdp.setGhiChu(request.getGhiChu());
        return thongTinDatPhongRepository.save(ttdp);
    }

    @Override
    public Page<TTDPResponse> HienThiQuanLy(String trangThai, Pageable pageable) {
        return thongTinDatPhongRepository.HienThiQuanLy(trangThai, pageable);
    }

    @Override
    public List<ThongTinDatPhong> findByMaDatPhong(String maDatPhong) {
        return thongTinDatPhongRepository.findByMaDatPhong(maDatPhong);
    }

    @Override
    public Page<TTDPResponse> findByDateRangeAndKey(LocalDate startDate, LocalDate endDate, String key,
                                                    String trangThai, Pageable pageable) {
        return thongTinDatPhongRepository.findByDateRangeAndKey(startDate, endDate, key, trangThai, pageable);
    }

    @Override
    public ThongTinDatPhong huyTTDP(String maTTDP) {
        // Lấy thông tin đặt phòng theo mã
        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPByMa(maTTDP);
        XepPhong xp = xepPhongRepository.getByMaTTDP(maTTDP);
        DatPhong dp = datPhongRepository.findByMaDatPhong(ttdp.getDatPhong().getMaDatPhong());

//        if(ttdp.getTrangThai().equalsIgnoreCase("Đang đặt phòng")){
//            khachHangServiceIMPL.deleteKhachHangDatPhong(dp.getKhachHang().getId());
//        }

        // Nếu có XepPhong liên quan, cập nhật trạng thái thành false
        if (xp != null) {
            xp.setTrangThai("Đã hủy");
            xepPhongRepository.save(xp);
        }

        // Cập nhật trạng thái của TTDP thành "Da huy"
        ttdp.setTrangThai("Đã hủy");
        thongTinDatPhongRepository.save(ttdp);

        // Kiểm tra tất cả TTDP liên quan đến DatPhong
        List<ThongTinDatPhong> allTtdp = thongTinDatPhongRepository.findByIDDatPhong(dp.getId());
        boolean allCancelled = allTtdp.stream().allMatch(item -> "Đã hủy".equals(item.getTrangThai()));

        // Nếu tất cả TTDP đều ở trạng thái "Da huy", cập nhật trạng thái DatPhong
        if (allCancelled) {
            dp.setTrangThai("Đã hủy");
            datPhongRepository.save(dp);
        }

        return ttdp;
    }

    @Override
    public ThongTinDatPhong getByMaTTDP(String maTTDP) {
        return thongTinDatPhongRepository.getTTDPByMa(maTTDP);
    }

    @Override
    public List<ThongTinDatPhong> getAllByIDDP(Integer iddp) {
        return thongTinDatPhongRepository.getAllByidDatPhong(iddp);
    }

    @Override
    public List<ThongTinDatPhong> getGioHang(Integer idDatPhong) {
        return thongTinDatPhongRepository.findByIDDatPhong(idDatPhong);
    }

    @Override
    public void xoaTTDP(Integer idTTDP) {
        thongTinDatPhongRepository.deleteById(idTTDP);
    }

}
