package com.example.datn.service.IMPL;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.datn.dto.request.HinhAnhRequest;
import com.example.datn.dto.response.HinhAnhResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.Phong;
import com.example.datn.repository.HinhAnhRepository;
import com.example.datn.repository.PhongRepository;
import com.example.datn.service.UploadImageFileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UploadImageFileServiceImpl implements UploadImageFileService {
    Cloudinary cloudinary;
    HinhAnhRepository hinhAnhRepository;
    PhongRepository phongRepository;

    @Override
    public Page<HinhAnh> getAllImages(Pageable pageable) {
        return hinhAnhRepository.findAll(pageable);
    }

    @Override
    public HinhAnhResponse uploadImage(HinhAnhRequest request, MultipartFile file) throws IOException {
        if (file.isEmpty() || file.getOriginalFilename() == null) {
            throw new IllegalArgumentException("File rỗng hoặc tên file không hợp lệ");
        }

        // Kiểm tra định dạng file
        String extension = getFileName(file.getOriginalFilename())[1].toLowerCase();
        if (!extension.matches("jpg|jpeg|png|gif")) {
            throw new IllegalArgumentException("Định dạng file không hợp lệ. Chỉ hỗ trợ jpg, jpeg, png, gif.");
        }

        String publicValue = generatePublicValue(file.getOriginalFilename());
        File fileUpload = convert(file);
        log.info("Đang upload file: {}", fileUpload);

        // Upload file lên Cloudinary
        try {
            cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("public_id", publicValue));
        } catch (Exception e) {
            throw new IOException("Lỗi khi upload lên Cloudinary: " + e.getMessage());
        }

        cleanDisk(fileUpload);

        HinhAnh hinhAnh = new HinhAnh();
        hinhAnh.setTenAnh(request.getTenAnh());
        hinhAnh.setDuongDan(cloudinary.url().generate(publicValue + "." + extension));
        hinhAnh.setTrangThai(request.getTrangThai());

        if (request.getIdPhong() != null) {
            Phong phong = phongRepository.findById(request.getIdPhong())
                    .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
            hinhAnh.setPhong(phong);
        }

        hinhAnhRepository.save(hinhAnh);

        HinhAnhResponse response = new HinhAnhResponse();
        response.setId(hinhAnh.getId());
        response.setTenAnh(hinhAnh.getTenAnh());
        response.setDuongDan(hinhAnh.getDuongDan());
        response.setTrangThai(hinhAnh.getTrangThai());

        if (request.getIdPhong() != null) {
            response.setIdPhong(request.getIdPhong());
        }

        return response;
    }

    @Override
    public String getImageUrl(Integer id) {
        HinhAnh hinhAnh = hinhAnhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hình ảnh không tồn tại!"));
        return hinhAnh.getDuongDan();
    }

    @Override
    public boolean deleteImage(Integer id) {
        HinhAnh hinhAnh = hinhAnhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hình ảnh không tồn tại"));

        // Xóa hình ảnh từ Cloudinary nếu cần
        String publicId = hinhAnh.getDuongDan().substring(hinhAnh.getDuongDan().lastIndexOf("/") + 1, hinhAnh.getDuongDan().lastIndexOf("."));
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        // Xóa hình ảnh từ cơ sở dữ liệu
        hinhAnhRepository.delete(hinhAnh);
        return true;
    }

    @Override
    public Page<HinhAnh> searchHinhAnh(String keyword, Pageable pageable) {
        return hinhAnhRepository.search(keyword, pageable);
    }

    @Override
    public List<HinhAnh> searchHinhAnhByIDPhong(String keyword) {
        return hinhAnhRepository.searchByIDPhong(keyword);
    }


    private File convert(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;
        File convFile = new File(StringUtils.join(generatePublicValue(file.getOriginalFilename()),
                getFileName(file.getOriginalFilename())));
        try (InputStream is = file.getInputStream()) {
            Files.copy(is, convFile.toPath());
        }
        return convFile;
    }

    private void cleanDisk(File file) {
        try {
            log.info("Đang xóa file tạm: {}", file.toPath());
            Path filePath = file.toPath();
            Files.delete(filePath);
        } catch (IOException e) {
            log.error("Lỗi khi xóa file tạm: {}", e.getMessage());
        }
    }

    public String generatePublicValue(String originalName) {
        String fileName = getFileName(originalName)[0];
        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
    }

    public String[] getFileName(String originalName) {
        return originalName.split("\\.");
    }
}
