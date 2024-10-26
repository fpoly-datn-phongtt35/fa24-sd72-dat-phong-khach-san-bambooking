package com.example.datn.service;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.model.DichVu;
import com.example.datn.model.DichVuDiKem;

import java.util.List;

public interface DichVuDiKemService {
    List<DichVuDiKem> getAll();
    DichVuDiKem addDichVuDiKem(DichVuDikemRequest dichVuDikemRequest);
    DichVuDiKem detailDichVuDiKem(Integer id);
    void updateStatus(Integer id);
    DichVuDiKem updateDichVuDiKem(DichVuDikemRequest dichVuDikemRequest);
    void deleteDichVuDiKem(Integer id);
    DichVuDiKem findById(Integer id);
    List<DichVuDiKem> findByAll(String key);
}
