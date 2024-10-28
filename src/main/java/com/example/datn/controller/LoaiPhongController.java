package com.example.datn.controller;



import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.service.IMPL.DichVuDiKemServiceIMPL;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/loai-phong")
public class LoaiPhongController {
    @Autowired
    LoaiPhongServiceIMPL phongServiceIMPL;
    @Autowired
    DichVuDiKemServiceIMPL dichVuDiKemServiceIMPL;

    @GetMapping("")
    public ResponseEntity<?> home(){
        List<LoaiPhong> lp = phongServiceIMPL.getAll();
        return ResponseEntity.ok(lp);
    }

    @GetMapping("/index")
    public ResponseEntity<?> DanhSachTienNghi(Pageable pageable){
        Page<LoaiPhongResponse> ti = phongServiceIMPL.getPage(pageable);
        return ResponseEntity.ok(ti);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody LoaiPhongRequest loaiPhongPhongRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(phongServiceIMPL.add(loaiPhongPhongRequest));
    }

    @PostMapping("/add-dich-vi-di-kem")
    public ResponseEntity<?> createDichVuDikem(@RequestBody DichVuDikemRequest dichVuDikemRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dichVuDiKemServiceIMPL.addDichVuDiKem(dichVuDikemRequest));
    }
    //    @GetMapping("/detail")
//    public String detail(@RequestParam("id") int id,Model model){
//        model.addAttribute("listTienNghi",tienNghiServiceIMPL.getAll());
//        model.addAttribute("TienNghi",tienNghiServiceIMPL.detail(id));
//        return "TienNghi/home";
//    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable int id){
        phongServiceIMPL.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody LoaiPhongRequest loaiPhong){
        phongServiceIMPL.update(loaiPhong);
        return ResponseEntity.status(HttpStatus.CREATED).body(phongServiceIMPL.update(loaiPhong));
    }

}
