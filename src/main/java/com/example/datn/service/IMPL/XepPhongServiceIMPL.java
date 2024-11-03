package com.example.datn.service.IMPL;

import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.model.Phong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.PhongRepository;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.service.XepPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class XepPhongServiceIMPL implements XepPhongService {
    @Autowired
    XepPhongRepository xepPhongRepository;

    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Autowired
    PhongRepository phongRepository;

    @Override
    public XepPhong addXepPhong(XepPhongRequest xepPhongRequest) {
        XepPhong xp = new XepPhong();
        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPById((xepPhongRequest.getThongTinDatPhong().getId()));
        Phong p = phongRepository.getPhongById(xepPhongRequest.getPhong().getId());
        xp.setPhong(xepPhongRequest.getPhong());
        xp.setThongTinDatPhong(xepPhongRequest.getThongTinDatPhong());
        xp.setNgayNhanPhong(xepPhongRequest.getNgayNhanPhong());
        xp.setNgayTraPhong(xepPhongRequest.getNgayTraPhong());
        xp.setTrangThai(xepPhongRequest.getTrangThai());

        ttdp.setTrangThai("Đã xếp");
        thongTinDatPhongRepository.save(ttdp);
        p.setTinhTrang("occupied");
        phongRepository.save(p);
        return xepPhongRepository.save(xp);
    }

    @Override
    public XepPhong updateXepPhong(XepPhongRequest xepPhongRequest) {
        XepPhong xp = new XepPhong();
        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPById((xepPhongRequest.getThongTinDatPhong().getId()));
        Phong p = phongRepository.getPhongById(xepPhongRequest.getPhong().getId());
        xp.setId(xepPhongRequest.getId());
        xp.setPhong(xepPhongRequest.getPhong());
        xp.setThongTinDatPhong(xepPhongRequest.getThongTinDatPhong());
        xp.setNgayNhanPhong(xepPhongRequest.getNgayNhanPhong());
        xp.setNgayTraPhong(xepPhongRequest.getNgayTraPhong());
        xp.setTrangThai(xepPhongRequest.getTrangThai());
        ttdp.setTrangThai("Đã xếp");
        thongTinDatPhongRepository.save(ttdp);
        p.setTinhTrang("occupied");
        phongRepository.save(p);
        return xepPhongRepository.save(xp);
    }

    @Override
    public XepPhong getByMaTTDP(String maTTDP) {
        return xepPhongRepository.getByMaTTDP(maTTDP);
    }
}
