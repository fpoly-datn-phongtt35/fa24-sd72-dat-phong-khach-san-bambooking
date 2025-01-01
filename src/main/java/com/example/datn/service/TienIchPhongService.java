package com.example.datn.service;

import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.model.VatTu;
import com.example.datn.model.VatTuLoaiPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TienIchPhongService {
    Page<TienIchPhongResponse> getPage( Pageable pageable);

    public VatTuLoaiPhong add(TienIchPhongRequest tienIch);

    public VatTu detail(Integer id);

    public void delete(Integer id);

    VatTuLoaiPhong update(TienIchPhongRequest tienIchPhongRequest);

    Page<TienIchPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong,Pageable pageable);

    Page<Object> ListTienIchFindByIDLoaiPhong (Integer idLoaiPhong,Pageable pageable);
}
