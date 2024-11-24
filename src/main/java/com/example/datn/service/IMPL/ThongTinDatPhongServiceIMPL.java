package com.example.datn.service.IMPL;

import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.TTDPResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.Phong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.service.ThongTinDatPhongService;
import com.example.datn.utilities.UniqueDatPhongCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ThongTinDatPhongServiceIMPL implements ThongTinDatPhongService {
    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

    @Autowired
    XepPhongRepository xepPhongRepository;

    @Override
    public List<ThongTinDatPhong> getAll() {
        return thongTinDatPhongRepository.findAll();
    }

    @Override
    public ThongTinDatPhong add(TTDPRequest request) {
        ThongTinDatPhong ttdp = new ThongTinDatPhong();
        LoaiPhong lp = loaiPhongServiceIMPL.findByID(request.getIdLoaiPhong());
        UniqueDatPhongCode code = new UniqueDatPhongCode();
        ttdp.setDatPhong(request.getDatPhong());
        ttdp.setLoaiPhong(lp);
        ttdp.setMaThongTinDatPhong(code.generateUniqueCodeTTDP(thongTinDatPhongRepository.findAll()));
        ttdp.setGiaDat(lp.getDonGia());
        ttdp.setNgayNhanPhong(request.getNgayNhanPhong());
        ttdp.setNgayTraPhong(request.getNgayTraPhong());
        ttdp.setSoNguoi(request.getSoNguoi());
        ttdp.setTrangThai(request.getTrangThai());
        ttdp.setGhiChu(request.getGhiChu());
        return thongTinDatPhongRepository.save(ttdp);
    }

    @Override
    public Page<ThongTinDatPhong> getAll(Pageable pageable) {
        return thongTinDatPhongRepository.findAll(pageable);
    }

    @Override
    public List<ThongTinDatPhong> getByIDDP(Integer iddp) {
        return thongTinDatPhongRepository.findByDatPhongId(iddp);
    }

    @Override
    public ThongTinDatPhong update(TTDPRequest request) {
        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPById(request.getId());
        LoaiPhong lp = loaiPhongServiceIMPL.findByID(request.getIdLoaiPhong());
        ttdp.setLoaiPhong(lp);
        ttdp.setGiaDat(lp.getDonGia());
        ttdp.setNgayNhanPhong(request.getNgayNhanPhong());
        ttdp.setNgayTraPhong(request.getNgayTraPhong());
        ttdp.setSoNguoi(request.getSoNguoi());
        ttdp.setTrangThai(request.getTrangThai());
        ttdp.setGhiChu(request.getGhiChu());
        return thongTinDatPhongRepository.save(ttdp);
    }

    @Override
    public Page<TTDPResponse> HienThiQuanLy(String trangThai, Pageable pageable) {
        return thongTinDatPhongRepository.HienThiQuanLy(trangThai,pageable);
    }

    @Override
    public List<ThongTinDatPhong>  findByMaDatPhong(String maDatPhong) {
        return thongTinDatPhongRepository.findByMaDatPhong(maDatPhong);
    }

    @Override
    public Page<TTDPResponse> findByDateRangeAndKey(LocalDate startDate, LocalDate endDate, String key,
                                                        String trangThai, Pageable pageable) {
        return thongTinDatPhongRepository.findByDateRangeAndKey(startDate,endDate,key,trangThai,pageable);
    }

    @Override
    public ThongTinDatPhong huyTTDP(String maTTDP) {
        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPByMa(maTTDP);
        XepPhong xp = xepPhongRepository.getByMaTTDP(maTTDP);
        if(xp!=null){
            xp.setTrangThai(false);
            xepPhongRepository.save(xp);
        }
        ttdp.setTrangThai("Da huy");
        thongTinDatPhongRepository.save(ttdp);
        return ttdp;
    }

    @Override
    public void kiemTraDenHan(List<ThongTinDatPhong> ttdps) {
        LocalDate ngayHienTai = LocalDate.now();
        for (ThongTinDatPhong ttdp : ttdps) {
            if (ttdp.getTrangThai().equals("Dang o")) {
                if (ttdp.getNgayTraPhong().isEqual(ngayHienTai)) {
                    ttdp.setTrangThai("Den han");
                    thongTinDatPhongRepository.save(ttdp);
                }
            }
        }
    }

    @Override
    public ThongTinDatPhong getByMaTTDP(String maTTDP) {
        return thongTinDatPhongRepository.getTTDPByMa(maTTDP);
    }
}
