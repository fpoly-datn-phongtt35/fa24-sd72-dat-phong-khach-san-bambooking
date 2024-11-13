package com.example.datn.service;

import com.example.datn.dto.request.HinhAnhRequest;
import com.example.datn.dto.response.HinhAnhResponse;
import com.example.datn.model.HinhAnh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UploadImageFileService {
    Page<HinhAnh> getAllImages(Pageable pageable);
    HinhAnhResponse uploadImage(HinhAnhRequest request, MultipartFile file) throws IOException;
    String getImageUrl(Integer id);
    boolean deleteImage(Integer id);
    Page<HinhAnh> searchHinhAnh(String keyword, Pageable pageable);

    List<HinhAnh> searchHinhAnhByIDPhong(String keyword);
}
