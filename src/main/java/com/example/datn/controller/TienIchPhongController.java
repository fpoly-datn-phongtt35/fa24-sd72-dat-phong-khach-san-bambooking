package com.example.datn.controller;

import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.model.TienIch;
import com.example.datn.model.TienIchPhong;
import com.example.datn.repository.TienIchPhongRepository;
import com.example.datn.repository.TienIchRepository;
import com.example.datn.service.IMPL.TienIchPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/tien-ich-phong")
public class TienIchPhongController {

    @Autowired
    TienIchPhongServiceIMPL tienNghiServiceIMPL;

    @Autowired
    TienIchRepository tienIchRepository;
//    @GetMapping("/home")
//    public ResponseEntity<?> DanhSachTienNghi(Pageable pageable){
//
//        Page<TienIchPhongResponse> ti = tienNghiServiceIMPL.getPage(pageable);
//        return ResponseEntity.ok(ti);
//    }

    @GetMapping("/home/{idLoaiPhong}")
    public ResponseEntity<?> ListTienIchByIDLoaiPhong(@PathVariable int idLoaiPhong,Pageable pageable) {
        Page<Object> ti =  tienNghiServiceIMPL.ListTienIchFindByIDLoaiPhong(idLoaiPhong,pageable);
        return ResponseEntity.ok(ti);

    }


    @GetMapping("/index")
    public List<TienIch> ListTienNghi(Pageable pageable) {

        return tienIchRepository.findAll();

    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody TienIchPhongRequest tienIchPhongRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tienNghiServiceIMPL.add(tienIchPhongRequest));
    }


    //    @GetMapping("/detail")
//    public String detail(@RequestParam("id") int id,Model model){
//        model.addAttribute("listTienNghi",tienNghiServiceIMPL.getAll());
//        model.addAttribute("TienNghi",tienNghiServiceIMPL.detail(id));
//        return "TienNghi/home";
//    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTienNghiPhong(@PathVariable int id) {
        try {
            tienNghiServiceIMPL.delete(id);
            return ResponseEntity.ok("Xóa tiện nghi thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tiện nghi không tồn tại");
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody TienIchPhongRequest tienIch) {
        tienNghiServiceIMPL.update(tienIch);
        return ResponseEntity.status(HttpStatus.CREATED).body(tienNghiServiceIMPL.update(tienIch));
    }

    @GetMapping("/findByIDLoaiPhong/{idLoaiPhong}")
    public ResponseEntity<?> findByIDLoaiPhong(@PathVariable int idLoaiPhong, Pageable pageable) {
        Page<TienIchPhongResponse> ti = tienNghiServiceIMPL.findByIDLoaiPhong(idLoaiPhong, pageable);
        return ResponseEntity.ok(ti);
    }


}
