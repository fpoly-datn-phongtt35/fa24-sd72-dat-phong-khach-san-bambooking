package com.example.datn.service.IMPL;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.TienIch;
import com.example.datn.repository.TienIchRepository;
import com.example.datn.service.TienIchService;
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
import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.dto.response.TienIchResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TienIchServiceIMPL implements TienIchService {
    @Autowired
    TienIchRepository tienIchRepository;

    Cloudinary cloudinary;

    @Override
    public List<TienIch> getAll() {
        return tienIchRepository.findAll();
    }
    @Override
    public Page<TienIchResponse> getPage(Pageable pageable) {

        return tienIchRepository.TienIch(pageable);
    }
    @Override
    public Page<TienIch> getAllTienIch(Pageable pageable) {
        return tienIchRepository.findAll(pageable);
    }



    @Override
    public TienIchResponse add(TienIchRequest tienIchRequest, MultipartFile file) throws IOException {
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

        TienIch tienIch = new TienIch();
        tienIch.setTenTienIch(tienIchRequest.getTenTienIch());
        tienIch.setHinhAnh(cloudinary.url().generate(publicValue + "." + extension));
        tienIchRepository.save(tienIch);

        TienIchResponse response = new TienIchResponse();
        response.setId(tienIch.getId());
        response.setTenTienIch(tienIch.getTenTienIch());
        response.setHinhAnh(tienIch.getHinhAnh());
        return response;
    }

    @Override
    public TienIch detail(Integer id) {
        return tienIchRepository.findById(id).get();
    }

    @Override
    public void delete(Integer id) {
        tienIchRepository.deleteById(id);
    }

    @Override
    public TienIchResponse update(TienIchRequest tienIchRequest, MultipartFile file) throws IOException {
        // Tìm tiện ích theo ID
        TienIch tienIch = tienIchRepository.findById(tienIchRequest.getId())
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
                tienIch.setHinhAnh(cloudinary.url().generate(publicValue + "." + extension));
            } catch (Exception e) {
                throw new IOException("Lỗi khi upload lên Cloudinary: " + e.getMessage());
            }
            cleanDisk(fileUpload);
        }

        // Cập nhật tên tiện ích
        tienIch.setTenTienIch(tienIchRequest.getTenTienIch());
        tienIchRepository.save(tienIch);

        // Tạo response sau khi cập nhật thành công
        TienIchResponse response = new TienIchResponse();
        response.setId(tienIch.getId());
        response.setTenTienIch(tienIch.getTenTienIch());
        response.setHinhAnh(tienIch.getHinhAnh());  // Giữ nguyên ảnh cũ nếu không upload ảnh mới
        return response;
    }


    @Override
    public  Page<TienIch> search(String tenTienIch,Pageable pageable) {
        return tienIchRepository.search(tenTienIch,pageable);
    }
    @Override
    public Page<TienIch> searchTienIch(String keyword, Pageable pageable) {
        return tienIchRepository.search(keyword, pageable);
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
