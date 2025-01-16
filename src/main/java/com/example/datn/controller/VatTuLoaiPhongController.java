package com.example.datn.controller;

import com.example.datn.dto.request.VatTuLoaiPhongRequest;
import com.example.datn.dto.response.VatTuLoaiPhongResponse;
import com.example.datn.model.VatTu;
import com.example.datn.repository.VatTuRepository;
import com.example.datn.service.IMPL.VatTuLoaiPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/vat-tu-loai-phong")
public class VatTuLoaiPhongController {

    @Autowired
    VatTuLoaiPhongServiceIMPL vatTuLoaiPhongServiceIMPL;

    @Autowired
    VatTuRepository vatTuRepository;
//    @GetMapping("/home")
//    public ResponseEntity<?> DanhSachTienNghi(Pageable pageable){
//
//        Page<TienIchPhongResponse> ti = tienNghiServiceIMPL.getPage(pageable);
//        return ResponseEntity.ok(ti);
//    }

    @GetMapping("/home/{idLoaiPhong}")
    public ResponseEntity<?> ListTienIchByIDLoaiPhong(@PathVariable int idLoaiPhong,Pageable pageable) {
        Page<Object> ti =  vatTuLoaiPhongServiceIMPL.ListVatTuFindByIDLoaiPhong(idLoaiPhong,pageable);
        return ResponseEntity.ok(ti);

    }


    @GetMapping("/index")
    public List<VatTu> ListVatTuLoaiPhong(Pageable pageable) {
        return vatTuRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody VatTuLoaiPhongRequest vatTuLoaiPhongRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vatTuLoaiPhongServiceIMPL.add(vatTuLoaiPhongRequest));
    }


    //    @GetMapping("/detail")
//    public String detail(@RequestParam("id") int id,Model model){
//        model.addAttribute("listTienNghi",tienNghiServiceIMPL.getAll());
//        model.addAttribute("TienNghi",tienNghiServiceIMPL.detail(id));
//        return "TienNghi/home";
//    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteVatTuLoaiPhong(@PathVariable int id) {
        try {
            vatTuLoaiPhongServiceIMPL.delete(id);
            return ResponseEntity.ok("Xóa vật tư loại phòng thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vật tư loại phòng không tồn tại");
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody VatTuLoaiPhongRequest vatTuLoaiPhongRequest) {
        vatTuLoaiPhongServiceIMPL.update(vatTuLoaiPhongRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(vatTuLoaiPhongServiceIMPL.update(vatTuLoaiPhongRequest));
    }

    @GetMapping("/findByIDLoaiPhong/{idLoaiPhong}")
    public ResponseEntity<?> findByIDLoaiPhong(@PathVariable int idLoaiPhong, Pageable pageable) {
        Page<VatTuLoaiPhongResponse> ti = vatTuLoaiPhongServiceIMPL.findByIDLoaiPhong(idLoaiPhong, pageable);
        return ResponseEntity.ok(ti);
    }


}
