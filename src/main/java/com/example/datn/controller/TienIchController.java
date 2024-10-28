package com.example.datn.controller;

import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.HinhAnhResponse;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.TienIch;
import com.example.datn.repository.TienIchRepository;
import com.example.datn.service.IMPL.TienIchPhongServiceIMPL;
import com.example.datn.service.IMPL.TienIchServiceIMPL;
import com.example.datn.service.TienIchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin
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
        List<TienIch> ti = tienIchRepository.findAll();
        return ResponseEntity.ok(ti);
    }
    @GetMapping("/index")
    public ResponseEntity<?> DanhSachTienIch(Pageable pageable){
        Page<TienIchResponse> ti = tienIchServiceIMPL.getPage(pageable);
        return ResponseEntity.ok(ti);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestParam("tenTienIch") String tenTienIch,
            @RequestParam("file") MultipartFile file) {
            TienIchRequest tienIchRequest = new TienIchRequest();
            tienIchRequest.setTenTienIch(tenTienIch);
        try {
            TienIchResponse response = tienIchServiceIMPL.add(tienIchRequest,file);
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
        TienIchRequest tienIchRequest = new TienIchRequest();
        tienIchRequest.setId(id);
        tienIchRequest.setTenTienIch(tenTienIch);
        try {
            TienIchResponse response = tienIchServiceIMPL.update(tienIchRequest,file);
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
        Page<TienIch> imagesPage = tienIchService.getAllTienIch(pageable);
        Page<TienIchResponse> responsePage = imagesPage.map(image -> {
            TienIchResponse response = new TienIchResponse();
            response.setId(image.getId());
            response.setTenTienIch(image.getTenTienIch());
            response.setHinhAnh(image.getHinhAnh());
            return response;
        });

        return ResponseEntity.ok(responsePage);
    }

}
