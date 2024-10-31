package com.example.datn.service.IMPL;

import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.service.XepPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class XepPhongServiceIMPL implements XepPhongService {
    @Autowired
    XepPhongRepository xepPhongRepository;

    @Override
    public XepPhong addXepPhong(XepPhongRequest xepPhongRequest) {
        XepPhong xp = new XepPhong();
        xp.setPhong(xepPhongRequest.getPhong());
        xp.setThongTinDatPhong(xepPhongRequest.getThongTinDatPhong());
        xp.setNgayNhanPhong(xepPhongRequest.getNgayNhanPhong());
        xp.setNgayTraPhong(xepPhongRequest.getNgayTraPhong());
        xp.setTrangThai(xepPhongRequest.getTrangThai());
        return xepPhongRepository.save(xp);
    }
}
