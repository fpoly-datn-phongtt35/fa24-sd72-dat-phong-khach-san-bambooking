package com.example.datn.service;

import com.example.datn.model.DichVu;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DichVuService {
    List<DichVu> getAll();
    DichVu addDichVu(DichVu dv, MultipartFile file) throws IOException;
    DichVu detailDichVu(Integer id);
    void updateStatus(Integer id);
    DichVu updateDichVu(DichVu dv, MultipartFile file) throws IOException;
    void deleteDichVu(Integer id);
    DichVu findById(Integer id);
    List<DichVu> findByAll(String key);
}

