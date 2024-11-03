package com.example.datn.service.IMPL;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.datn.model.DichVu;
import com.example.datn.repository.DichVuRepository;
import com.example.datn.service.DichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class DichVuServiceIMPL implements DichVuService {
    @Autowired
    DichVuRepository dichVuRepository;
    Cloudinary cloudinary;

    @Override
    public List<DichVu> getAll() {
        return dichVuRepository.findAll();
    }

    public DichVuServiceIMPL(@Value("${cloudinary.cloud_name}") String cloudName,  // Sửa từ cloud-name thành cloud_name
                             @Value("${cloudinary.api_key}") String apiKey,      // Sửa từ api-key thành api_key
                             @Value("${cloudinary.api_secret}") String apiSecret) { // Sửa từ api-secret thành api_secret
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }


    @Override
    public DichVu addDichVu(DichVu dv, MultipartFile file) throws IOException {
        // Tải lên ảnh lên Cloudinary
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String hinhAnhUrl = (String) uploadResult.get("secure_url");

        // Cập nhật URL hình ảnh vào đối tượng DichVu
        dv.setHinhAnh(hinhAnhUrl);

        // Lưu DichVu vào cơ sở dữ liệu
        return dichVuRepository.save(dv);
    }

//    @Override
//    public DichVu addDichVu(DichVu dv) {
//       return dichVuRepository.save(dv);
//    }

    @Override
    public DichVu detailDichVu(Integer id) {
        return dichVuRepository.getReferenceById(id);
    }

    @Override
    public void updateStatus(Integer id) {
        DichVu dichVu = dichVuRepository.findById(id).orElse(null);
        if (dichVu != null) {
            if (dichVu.getTrangThai()) {
                dichVu.setTrangThai(false);
            } else {
                dichVu.setTrangThai(true);
            }
            dichVuRepository.save(dichVu);
        }

    }

    @Override
    public DichVu updateDichVu(DichVu dv, MultipartFile file) throws IOException {
        // Kiểm tra xem có tệp hình ảnh mới hay không
        if (file != null && !file.isEmpty()) {
            // Tải lên ảnh lên Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String hinhAnhUrl = (String) uploadResult.get("secure_url");

            // Cập nhật URL hình ảnh vào đối tượng DichVu
            dv.setHinhAnh(hinhAnhUrl);
        }

        // Cập nhật thông tin DichVu vào cơ sở dữ liệu
        return dichVuRepository.save(dv);
    }

    @Override
    public void deleteDichVu(Integer id) {
        dichVuRepository.deleteById(id);
    }

    @Override
    public DichVu findById(Integer id) {
        return dichVuRepository.findById(id).get();
    }

    @Override
    public List<DichVu> findByAll(String key) {
        return dichVuRepository.findByTenDichVu(key);
    }
}
