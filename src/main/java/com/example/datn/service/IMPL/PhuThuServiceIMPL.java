package com.example.datn.service.IMPL;

import com.example.datn.dto.request.PhuThuRequest;
import com.example.datn.model.PhuThu;
import com.example.datn.repository.PhuThuRepository;
import com.example.datn.service.PhuThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhuThuServiceIMPL implements PhuThuService {
    @Autowired
    PhuThuRepository phuThuRepository;

    @Override
    public PhuThu addPhuThu(PhuThuRequest phuThuRequest) {
        PhuThu phuThu = new PhuThu();
        phuThu.setXepPhong(phuThuRequest.getXepPhong());
        phuThu.setTenPhuThu(phuThuRequest.getTenPhuThu());
        phuThu.setTienPhuThu(phuThuRequest.getTienPhuThu());
        phuThu.setSoLuong(phuThuRequest.getSoLuong() != null ? phuThuRequest.getSoLuong() : 1);
        phuThu.setTrangThai(phuThuRequest.getTrangThai() != null ? phuThuRequest.getTrangThai() : false);
        return phuThuRepository.save(phuThu);
    }
}
