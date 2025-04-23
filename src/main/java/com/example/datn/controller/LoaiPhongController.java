package com.example.datn.controller;



import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.LoaiPhong;
import com.example.datn.service.IMPL.DichVuDiKemServiceIMPL;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import com.example.datn.service.LoaiPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

//@CrossOrigin("*")
@RestController
@RequestMapping("/loai-phong")
public class LoaiPhongController {
    @Autowired
    LoaiPhongServiceIMPL phongServiceIMPL;
    @Autowired
    DichVuDiKemServiceIMPL dichVuDiKemServiceIMPL;
    @Autowired
    LoaiPhongService loaiPhongService;
    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

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

    @GetMapping("/filter")
    public ResponseEntity<?> search(@RequestParam(value="tenLoaiPhong", required = false) String tenLoaiPhong,
                                    @RequestParam(value="dienTichMin", required = false) Integer dienTichMin,
                                    @RequestParam(value="dienTichMax", required = false) Integer dienTichMax,
                                    @RequestParam(value="soKhach", required = false) Integer soKhach,
                                    @RequestParam(value="donGiaMin", required = false) Double donGiaMin,
                                    @RequestParam(value="donGiaMax", required = false) Double donGiaMax,
                                    @RequestParam(value="donGiaPhuThuMin", required = false) Double donGiaPhuThuMin,
                                    @RequestParam(value="donGiaPhuThuMax", required = false) Double donGiaPhuThuMax,
                                    Pageable pageable) {
        Page<LoaiPhong> lp = phongServiceIMPL.filter(tenLoaiPhong,dienTichMin,dienTichMax,soKhach,donGiaMin,
                                                     donGiaMax,donGiaPhuThuMin,donGiaPhuThuMax,pageable);
        return ResponseEntity.ok(lp);
    }

    @GetMapping("/loai-phong-kha-dung-list")
    public ResponseEntity<?> getLoaiPhongKhaDungResponseList (@RequestParam(value = "ngayNhanPhong")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
                                        @RequestParam(value = "ngayTraPhong")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong){
        return ResponseEntity.ok(loaiPhongServiceIMPL.getAllLPKDR(ngayNhanPhong,ngayTraPhong));
    }

    @GetMapping("/lpkdr-list")
    public ResponseEntity<?> getLPKDRL (@RequestParam(value = "ngayNhanPhong")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
                                        @RequestParam(value = "ngayTraPhong")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong,
                                        @RequestParam("soNguoi") Integer soNguoi,
                                        @RequestParam("soPhong") Integer soPhong,
                                        @RequestParam(value = "idLoaiPhong", required = false) Integer idLoaiPhong){
        return ResponseEntity.ok(loaiPhongServiceIMPL.getLoaiPhongKhaDungResponseList(ngayNhanPhong,ngayTraPhong,soNguoi,soPhong,idLoaiPhong));
    }
    @GetMapping("/{id}")
    public ResponseEntity<LoaiPhong> getLoaiPhongById(@PathVariable int id) {
        return loaiPhongService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
