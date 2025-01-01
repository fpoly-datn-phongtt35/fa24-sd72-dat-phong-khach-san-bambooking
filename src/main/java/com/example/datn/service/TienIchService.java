package com.example.datn.service;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.VatTu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TienIchService {
    List<VatTu> getAll();
    Page<TienIchResponse> getPage(Pageable pageable);

    public TienIchResponse add(TienIchRequest tienIch, MultipartFile file) throws IOException;

    public VatTu detail(Integer id);

    public void delete(Integer id);

    TienIchResponse update(TienIchRequest tienIch, MultipartFile file) throws IOException;

    Page<VatTu> search (String tenTienIch, Pageable pageable);

    Page<VatTu> getAllTienIch(Pageable pageable);

    Page<VatTu> searchTienIch(String keyword, Pageable pageable);
}
