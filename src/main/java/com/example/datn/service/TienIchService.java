package com.example.datn.service;
import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.TienIch;
import com.example.datn.model.TienIchPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TienIchService {
    List<TienIch> getAll();
    Page<TienIchResponse> getPage(Pageable pageable);

    public TienIchResponse add(TienIchRequest tienIch, MultipartFile file) throws IOException;

    public TienIch detail(Integer id);

    public void delete(Integer id);

    TienIchResponse update(TienIchRequest tienIch, MultipartFile file) throws IOException;

    Page<TienIch> search ( String tenTienIch, Pageable pageable);

    Page<TienIch> getAllTienIch(Pageable pageable);

    Page<TienIch> searchTienIch(String keyword, Pageable pageable);
}
