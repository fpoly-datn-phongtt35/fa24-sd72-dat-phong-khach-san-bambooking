package com.example.datn.controller;

import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.service.IMPL.TienIchPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/tien-nghi")
public class TienIchPhongController {

    @Autowired
    TienIchPhongServiceIMPL tienNghiServiceIMPL;
    @GetMapping("/home")
    public ResponseEntity<?> DanhSachTienNghi(Pageable pageable){

        Page<TienIchPhongResponse> ti = tienNghiServiceIMPL.getPage(pageable);
        return ResponseEntity.ok(ti);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody TienIchPhongRequest tienIchPhongRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(tienNghiServiceIMPL.add(tienIchPhongRequest));
    }

//    @GetMapping("/detail")
//    public String detail(@RequestParam("id") int id,Model model){
//        model.addAttribute("listTienNghi",tienNghiServiceIMPL.getAll());
//        model.addAttribute("TienNghi",tienNghiServiceIMPL.detail(id));
//        return "TienNghi/home";
//    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable int id){
        tienNghiServiceIMPL.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody TienIchPhongRequest tienIch){
        tienNghiServiceIMPL.update(tienIch);
        return ResponseEntity.status(HttpStatus.CREATED).body(tienNghiServiceIMPL.update(tienIch));
    }

}
