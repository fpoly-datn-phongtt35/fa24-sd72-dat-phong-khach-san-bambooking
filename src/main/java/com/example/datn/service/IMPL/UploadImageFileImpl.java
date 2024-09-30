package com.example.datn.service.IMPL;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.datn.service.UploadImageFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UploadImageFileImpl implements UploadImageFile {
    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        // Kiểm tra file không rỗng
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

        // Xóa file tạm sau khi upload
        cleanDisk(fileUpload);

        // Trả về URL của hình ảnh
        return cloudinary.url().generate(publicValue + "." + extension);
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
