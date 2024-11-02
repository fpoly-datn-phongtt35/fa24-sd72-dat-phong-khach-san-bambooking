package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.response.DichVuDiKemResponse;
import com.example.datn.model.DichVuDiKem;
import com.example.datn.repository.DichVuDiKemRepository;
import com.example.datn.service.DichVuDiKemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DichVuDiKemServiceIMPL implements DichVuDiKemService {
    @Autowired
    DichVuDiKemRepository dichVuDiKemRepository;

    @Override
    public List<DichVuDiKem> getAll() {
        return dichVuDiKemRepository.findAll();
    }

    @Override
    public DichVuDiKem addDichVuDiKem(DichVuDikemRequest dichVuDikemRequest) {
        DichVuDiKem dichVuDiKem = new DichVuDiKem();
        dichVuDiKem.setDichVu(dichVuDikemRequest.getDichVu());
        dichVuDiKem.setLoaiPhong(dichVuDikemRequest.getLoaiPhong());
        dichVuDiKem.setTrangThai(dichVuDikemRequest.getTrangThai());
        return dichVuDiKemRepository.save(dichVuDiKem);
    }

    @Override
    public DichVuDiKem detailDichVuDiKem(Integer id) {
        return dichVuDiKemRepository.findById(id).get();
    }

    @Override
    public void updateStatus(Integer id) {
        DichVuDiKem dichVuDiKem = dichVuDiKemRepository.findById(id).orElse(null);
        if (dichVuDiKem != null) {
            if (dichVuDiKem.getTrangThai()) {
                dichVuDiKem.setTrangThai(false);
            } else {
                dichVuDiKem.setTrangThai(true);
            }
            dichVuDiKemRepository.save(dichVuDiKem);
        }
    }

    @Override
    public DichVuDiKem updateDichVuDiKem(DichVuDikemRequest  dichVuDikemRequest) {
        // Tìm dịch vụ đi kèm bằng ID
        DichVuDiKem dichVuDiKem = dichVuDiKemRepository.findById(dichVuDikemRequest.getId()).orElse(null);

        if (dichVuDiKem != null) {
            dichVuDiKem.setDichVu(dichVuDikemRequest.getDichVu());
            dichVuDiKem.setLoaiPhong(dichVuDikemRequest.getLoaiPhong());
            dichVuDiKem.setTrangThai(dichVuDikemRequest.getTrangThai());

            return dichVuDiKemRepository.save(dichVuDiKem);
        }

        return null;
    }

    @Override
    public void deleteDichVuDiKem(Integer id) {
        dichVuDiKemRepository.deleteById(id);
    }

    @Override
    public DichVuDiKem findById(Integer id) {
        return dichVuDiKemRepository.findById(id).get();
    }

    @Override
    public Page<DichVuDiKemResponse> findByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable) {
        return dichVuDiKemRepository.findByIDLoaiPhong(idLoaiPhong,pageable);
    }


}
