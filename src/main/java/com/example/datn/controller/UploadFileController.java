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

@CrossOrigin("*")
@RequestMapping("/image")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UploadFileController {
    UploadImageFileService uploadImageFile;

    @GetMapping("")
    public ResponseEntity<?> getImages(Pageable pageable) {
        Page<HinhAnh> imagesPage = uploadImageFile.getAllImages(pageable);
        Page<HinhAnhResponse> responsePage = imagesPage.map(image -> {
            HinhAnhResponse response = new HinhAnhResponse();
            response.setId(image.getId());
            response.setTenPhong(image.getPhong().getTenPhong());
            response.setTenAnh(image.getTenAnh());
            response.setDuongDan(image.getDuongDan());
            response.setTrangThai(image.getTrangThai());
            if (image.getPhong() != null) {
                response.setIdPhong(image.getPhong().getId());
                response.setTenPhong(image.getPhong().getTenPhong());
            }
            return response;
        });

        return ResponseEntity.ok(responsePage);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("idPhong") Integer idPhong,
            @RequestParam("tenAnh") String tenAnh,
            @RequestParam("trangThai") String  trangThai
    ) {
        HinhAnhRequest request = new HinhAnhRequest();
        request.setIdPhong(idPhong);
        request.setTenAnh(tenAnh);
        // Chuyển đổi từ String sang boolean
        boolean trangThaiBoolean = Boolean.parseBoolean(trangThai);
        request.setTrangThai(trangThaiBoolean); // Gán giá trị đã chuyển đổi

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

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(value = "keyword", required = false) String keyword, Pageable pageable){
        return ResponseEntity.status(HttpStatus.OK).body(uploadImageFile.searchHinhAnh(keyword, pageable));
    }
    @GetMapping("/searchByIDPhong")
    public ResponseEntity<?> searchByIDPhong(@RequestParam(value = "keyword", required = false) String keyword){
        return ResponseEntity.status(HttpStatus.OK).body(uploadImageFile.searchHinhAnhByIDPhong(keyword));
    }
}
