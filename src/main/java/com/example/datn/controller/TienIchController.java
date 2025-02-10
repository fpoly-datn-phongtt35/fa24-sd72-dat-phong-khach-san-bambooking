package com.example.datn.controller;

import com.example.datn.dto.request.VatTuRequest;
import com.example.datn.dto.response.VatTuResponse;
import com.example.datn.model.VatTu;
import com.example.datn.repository.TienIchRepository;
import com.example.datn.service.IMPL.TienIchServiceIMPL;
import com.example.datn.service.TienIchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

//@CrossOrigin
@RestController
@RequestMapping("/tien-ich")
public class TienIchController {

    @Autowired
    TienIchRepository tienIchRepository;

    @Autowired
    TienIchService tienIchService;
    @Autowired
    TienIchServiceIMPL tienIchServiceIMPL;
    @GetMapping("/home")
    public ResponseEntity<?> ListTienIch(){
        List<VatTu> ti = tienIchRepository.findAll();
        return ResponseEntity.ok(ti);
    }
    @GetMapping("/index")
    public ResponseEntity<?> DanhSachTienIch(Pageable pageable){
        Page<VatTuResponse> ti = tienIchServiceIMPL.getPage(pageable);
        return ResponseEntity.ok(ti);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestParam("tenTienIch") String tenTienIch,
            @RequestParam("file") MultipartFile file) {
            VatTuRequest vatTuRequest = new VatTuRequest();
            vatTuRequest.setTenVatTu(tenTienIch);
        try {
            VatTuResponse response = tienIchServiceIMPL.add(vatTuRequest,file);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Lỗi khi tải lên hình ảnh: " + e.getMessage());
        }

    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable int id){
        tienIchServiceIMPL.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestParam("id") Integer id,
                                    @RequestParam("tenTienIch") String tenTienIch,
                                    @RequestParam(value = "file", required = false) MultipartFile file) {
        VatTuRequest vatTuRequest = new VatTuRequest();
        vatTuRequest.setId(id);
        vatTuRequest.setTenVatTu(tenTienIch);
        try {
            VatTuResponse response = tienIchServiceIMPL.update(vatTuRequest,file);
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
    public ResponseEntity<?> search(@RequestParam(value = "keyword", required = false) String keyword, Pageable pageable){
        return ResponseEntity.status(HttpStatus.OK).body(tienIchService.searchTienIch(keyword, pageable));
    }


    @GetMapping("")
    public ResponseEntity<?> getAllTienIch(Pageable pageable) {
        Page<VatTu> imagesPage = tienIchService.getAllTienIch(pageable);
        Page<VatTuResponse> responsePage = imagesPage.map(image -> {
            VatTuResponse response = new VatTuResponse();
            response.setId(image.getId());
            response.setTenVatTu(image.getTenVatTu());
            response.setHinhAnh(image.getHinhAnh());
            return response;
        });

        return ResponseEntity.ok(responsePage);
    }

}
