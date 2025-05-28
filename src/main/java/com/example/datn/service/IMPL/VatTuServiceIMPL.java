package com.example.datn.service.IMPL;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.datn.model.VatTu;
import com.example.datn.repository.VatTuRepository;
import com.example.datn.service.VatTuService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.example.datn.dto.request.VatTuRequest;
import com.example.datn.dto.response.VatTuResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VatTuServiceIMPL implements VatTuService {
    @Autowired
    VatTuRepository vatTuRepository;

    Cloudinary cloudinary;

    @Override
    public List<VatTu> getAll() {
        return vatTuRepository.findAll();
    }
    @Override
    public Page<VatTuResponse> getPage(Pageable pageable) {

        return vatTuRepository.VatTu(pageable);
    }
    @Override
    public Page<VatTu> getAllVatTu(Pageable pageable) {
        return vatTuRepository.findAll(pageable);
    }



    @Override
    public VatTuResponse add(VatTuRequest vatTuRequest, MultipartFile file) throws IOException {
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

        VatTu vatTu = new VatTu();
        vatTu.setTenVatTu(vatTuRequest.getTenVatTu());
        vatTu.setHinhAnh(cloudinary.url().generate(publicValue + "." + extension));
        vatTu.setGia(vatTuRequest.getGia());
        vatTu.setTrangThai(vatTuRequest.getTrangThai());
        vatTuRepository.save(vatTu);

        VatTuResponse response = new VatTuResponse();
        response.setId(vatTu.getId());
        response.setTenVatTu(vatTu.getTenVatTu());
        response.setHinhAnh(vatTu.getHinhAnh());
        response.setGia(vatTu.getGia());
        response.setTrangThai(vatTu.getTrangThai());
        return response;
    }

    @Override
    public VatTu detail(Integer id) {
        return vatTuRepository.findById(id).get();
    }

    @Override
    public void delete(Integer id) {
        vatTuRepository.deleteById(id);
    }

    @Override
    public VatTuResponse update(VatTuRequest vatTuRequest, MultipartFile file) throws IOException {
        // Tìm tiện ích theo ID
        VatTu vatTu = vatTuRepository.findById(vatTuRequest.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tiện ích với ID này"));

        // Kiểm tra nếu có file mới, chỉ xử lý upload khi file không rỗng
        if (file != null && !file.isEmpty() && file.getOriginalFilename() != null) {
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
                vatTu.setHinhAnh(cloudinary.url().generate(publicValue + "." + extension));
            } catch (Exception e) {
                throw new IOException("Lỗi khi upload lên Cloudinary: " + e.getMessage());
            }
            cleanDisk(fileUpload);
        }

        // Cập nhật tên tiện ích
        vatTu.setTenVatTu(vatTuRequest.getTenVatTu());
        vatTu.setGia(vatTuRequest.getGia());
        vatTu.setTrangThai(vatTuRequest.getTrangThai());
        vatTuRepository.save(vatTu);

        // Tạo response sau khi cập nhật thành công
        VatTuResponse response = new VatTuResponse();
        response.setId(vatTu.getId());
        response.setTenVatTu(vatTu.getTenVatTu());
        response.setGia(vatTu.getGia());
        response.setHinhAnh(vatTu.getHinhAnh());  // Giữ nguyên ảnh cũ nếu không upload ảnh mới
        response.setTrangThai(vatTu.getTrangThai());
        return response;
    }


    @Override
    public  Page<VatTu> search(String tenTienIch, Pageable pageable) {
        return vatTuRepository.search(tenTienIch,pageable);
    }
    @Override
    public Page<VatTu> searchVatTu(String keyword, Pageable pageable) {
        return vatTuRepository.search(keyword, pageable);
    }

    public String[] getFileName(String originalName) {
        return originalName.split("\\.");
    }

    public String generatePublicValue(String originalName) {
        String fileName = getFileName(originalName)[0];
        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
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

}
