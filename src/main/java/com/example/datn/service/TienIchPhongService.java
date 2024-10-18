package com.example.datn.service;

import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.model.TienIch;
import com.example.datn.model.TienIchPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TienIchPhongService {
    Page<TienIchPhongResponse> getPage( Pageable pageable);

    public TienIchPhong add(TienIchPhongRequest tienIch);

    public TienIch detail(Integer id);

    public void delete(Integer id);

    TienIchPhong update(TienIchPhongRequest tienIchPhongRequest);

    Page<TienIchPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong,Pageable pageable);
}
