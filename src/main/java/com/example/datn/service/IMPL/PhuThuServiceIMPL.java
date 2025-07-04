package com.example.datn.service.IMPL;

import com.example.datn.dto.request.PhuThuRequest;
import com.example.datn.model.PhuThu;
import com.example.datn.repository.PhuThuRepository;
import com.example.datn.service.PhuThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    @Override
    public PhuThu updatePhuThu(PhuThuRequest phuThuRequest) {
        PhuThu phuThu = phuThuRepository.findById(phuThuRequest.getId()).orElseThrow(() -> new RuntimeException("PhuThu not found"));
        phuThu.setTienPhuThu(phuThuRequest.getTienPhuThu());
        phuThu.setSoLuong(phuThuRequest.getSoLuong());
        phuThu.setTenPhuThu(phuThuRequest.getTenPhuThu());
        phuThu.setTrangThai(phuThuRequest.getTrangThai());
        return phuThuRepository.save(phuThu);
    }


        @Override
        public PhuThu checkIfPhuThuExists(Integer idXepPhong) {
            return phuThuRepository.findTopByXepPhong_IdOrderByIdDesc(idXepPhong);
        }

    @Override
    public void deletePhuThu(Integer id) {
        if (!phuThuRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phụ thu để xóa");
        }
        phuThuRepository.deleteById(id);
    }

    @Override
    public PhuThu findByXepPhongIdAndTenPhuThu(Integer idXepPhong, String tenPhuThu) {
        return phuThuRepository.findByXepPhong_IdAndTenPhuThu(idXepPhong, tenPhuThu);
    }
}
