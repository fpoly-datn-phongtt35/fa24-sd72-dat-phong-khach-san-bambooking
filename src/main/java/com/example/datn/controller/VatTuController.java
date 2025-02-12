package com.example.datn.controller;

import com.example.datn.dto.request.VatTuRequest;
import com.example.datn.dto.response.VatTuResponse;
import com.example.datn.model.VatTu;
import com.example.datn.repository.VatTuRepository;
import com.example.datn.service.IMPL.VatTuServiceIMPL;
import com.example.datn.service.VatTuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/vat-tu")
public class VatTuController {

    @Autowired
    VatTuRepository vatTuRepository;

    @Autowired
    VatTuService vatTuService;
    @Autowired
    VatTuServiceIMPL vatTuServiceIMPL;

    @GetMapping("/home")
    public ResponseEntity<?> ListVatTu() {
        List<VatTu> ti = vatTuRepository.findAll();
        return ResponseEntity.ok(ti);
    }

    @GetMapping("/index")
    public ResponseEntity<?> DanhSachVatTu(Pageable pageable) {
        Page<VatTuResponse> ti = vatTuServiceIMPL.getPage(pageable);
        return ResponseEntity.ok(ti);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestParam("tenVatTu") String tenVatTu, @RequestParam("gia") Double gia,
                                 @RequestParam("file") MultipartFile file) {
        VatTuRequest vatTuRequest = new VatTuRequest();
        vatTuRequest.setTenVatTu(tenVatTu);
        vatTuRequest.setGia(gia);
        try {
            VatTuResponse response = vatTuServiceIMPL.add(vatTuRequest, file);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi khi tải lên hình ảnh: " + e.getMessage());
        }

    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        vatTuServiceIMPL.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestParam("id") Integer id,
                                    @RequestParam("tenVatTu") String tenVatTu,
                                    @RequestParam("gia") Double gia,
                                    @RequestParam(value = "file", required = false) MultipartFile file) {
        VatTuRequest vatTuRequest = new VatTuRequest();
        vatTuRequest.setId(id);
        vatTuRequest.setTenVatTu(tenVatTu);
        vatTuRequest.setGia(gia);
        try {
            VatTuResponse response = vatTuServiceIMPL.update(vatTuRequest, file);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi khi tải lên hình ảnh: " + e.getMessage());
        }

    }

//    @GetMapping("/search")
//    public ResponseEntity<?> search(@RequestParam("tenTienIch") String tenTienIch, Pageable pageable) {
//        Page<TienIch> ti = tienIchServiceIMPL.search(tenTienIch, pageable);
//        return ResponseEntity.ok(ti);
//    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(value = "keyword", required = false) String keyword, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(vatTuService.searchVatTu(keyword, pageable));
    }


    @GetMapping("")
    public ResponseEntity<?> getAllVatTu(Pageable pageable) {
        Page<VatTu> imagesPage = vatTuService.getAllVatTu(pageable);
        Page<VatTuResponse> responsePage = imagesPage.map(image -> {
            VatTuResponse response = new VatTuResponse();
            response.setId(image.getId());
            response.setTenVatTu(image.getTenVatTu());
            response.setHinhAnh(image.getHinhAnh());
            response.setGia(image.getGia());
            return response;
        });

        return ResponseEntity.ok(responsePage);
    }

}
