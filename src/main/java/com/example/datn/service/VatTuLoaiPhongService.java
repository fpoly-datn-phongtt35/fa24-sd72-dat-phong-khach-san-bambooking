package com.example.datn.service;

import com.example.datn.dto.request.VatTuLoaiPhongRequest;
import com.example.datn.dto.response.VatTuLoaiPhongResponse;
import com.example.datn.model.VatTu;
import com.example.datn.model.VatTuLoaiPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VatTuLoaiPhongService {
    Page<VatTuLoaiPhongResponse> getPage(Pageable pageable);

    public VatTuLoaiPhong add(VatTuLoaiPhongRequest tienIch);

    public VatTu detail(Integer id);

    public void delete(Integer id);

    VatTuLoaiPhong update(VatTuLoaiPhongRequest vatTuLoaiPhongRequest);

    List<VatTuLoaiPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong);

    Page<Object> ListVatTuFindByIDLoaiPhong (Integer idLoaiPhong,Pageable pageable);
}
