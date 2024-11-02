package com.example.datn.service;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.response.DichVuDiKemResponse;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.model.DichVu;
import com.example.datn.model.DichVuDiKem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DichVuDiKemService {
    List<DichVuDiKem> getAll();
    DichVuDiKem addDichVuDiKem(DichVuDikemRequest dichVuDikemRequest);
    DichVuDiKem detailDichVuDiKem(Integer id);
    void updateStatus(Integer id);
    DichVuDiKem updateDichVuDiKem(DichVuDikemRequest dichVuDikemRequest);
    void deleteDichVuDiKem(Integer id);
    DichVuDiKem findById(Integer id);
    Page<DichVuDiKemResponse> findByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable);
}
