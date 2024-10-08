package com.example.datn.service;
import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.TienIch;
import com.example.datn.model.TienIchPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TienIchService {
    List<TienIch> getAll();
    Page<TienIchResponse> getPage(Pageable pageable);

    public TienIch add(TienIchRequest tienIch);

    public TienIch detail(Integer id);

    public void delete(Integer id);

    TienIch update(TienIchRequest tienIchRequest);

    Page<TienIch> search ( String tenTienIch, Pageable pageable);
}
