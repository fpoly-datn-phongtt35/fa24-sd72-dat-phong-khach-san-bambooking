package com.example.datn.service;

import com.example.datn.dto.request.VatTuLoaiPhongRequest;
import com.example.datn.dto.response.VatTuLoaiPhongPhongResponse;
import com.example.datn.model.VatTu;
import com.example.datn.model.VatTuLoaiPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TienIchPhongService {
    Page<VatTuLoaiPhongPhongResponse> getPage(Pageable pageable);

    public VatTuLoaiPhong add(VatTuLoaiPhongRequest tienIch);

    public VatTu detail(Integer id);

    public void delete(Integer id);

    VatTuLoaiPhong update(VatTuLoaiPhongRequest vatTuLoaiPhongRequest);

    Page<VatTuLoaiPhongPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable);

    Page<Object> ListTienIchFindByIDLoaiPhong (Integer idLoaiPhong,Pageable pageable);
}
