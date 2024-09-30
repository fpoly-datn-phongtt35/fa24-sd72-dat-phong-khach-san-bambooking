package com.example.datn.controller;

import com.example.datn.dto.request.HinhAnhRequest;
import com.example.datn.dto.response.HinhAnhResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.service.UploadImageFileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequestMapping("/image")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UploadFileController {
    UploadImageFileService uploadImageFile;

    @GetMapping("/list")
    public ResponseEntity<Page<HinhAnhResponse>> getImages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HinhAnh> imagesPage = uploadImageFile.getAllImages(pageable);

        Page<HinhAnhResponse> responsePage = imagesPage.map(image -> {
            HinhAnhResponse response = new HinhAnhResponse();
            response.setId(image.getId());
            response.setTenAnh(image.getTenAnh());
            response.setDuongDan(image.getDuongDan());
            response.setTrangThai(image.getTrangThai());
            if (image.getPhong() != null) {
                response.setIdPhong(image.getPhong().getId());
            }
            return response;
        });

        return ResponseEntity.ok(responsePage);
    }

    @PostMapping("/url")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("idPhong") Integer idPhong,
            @RequestParam("tenAnh") String tenAnh,
            @RequestParam("trangThai") String trangThai
    ) {
        HinhAnhRequest request = new HinhAnhRequest();
        request.setIdPhong(idPhong);
        request.setTenAnh(tenAnh);
        request.setTrangThai(trangThai);

        try {
            HinhAnhResponse response = uploadImageFile.uploadImage(request, file);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi khi tải lên hình ảnh: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getImageUrl(@PathVariable("id") Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(uploadImageFile.getImageUrl(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable("id") Integer id) {
        boolean isDeleted = uploadImageFile.deleteImage(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.OK).body("Hình ảnh đã được xóa thành công.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hình ảnh không tồn tại.");
        }
    }
    
}
