package com.example.datn.service.IMPL;

import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.TTDPResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.repository.ThongTinDatPhongRepository;
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
        ttdp.setGiaDat(request.getGiaDat());
        ttdp.setNgayNhanPhong(request.getNgayNhanPhong());
        ttdp.setNgayTraPhong(request.getNgayTraPhong());
        ttdp.setSoNguoi(request.getSoNguoi());
        ttdp.setTrangThai(request.getTrangThai());
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
        return null;
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

}
