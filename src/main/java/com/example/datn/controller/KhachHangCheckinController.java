package com.example.datn.controller;

import com.example.datn.dto.request.KhachHangCheckinRequest;
import com.example.datn.model.KhachHangCheckin;
import com.example.datn.service.IMPL.KhachHangCheckinServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("khach-hang-checkin")
public class KhachHangCheckinController {
    @Autowired
    KhachHangCheckinServiceIMPL khachHangCheckinServiceIMPL;

    @GetMapping("hien-thi")
    public ResponseEntity<List<KhachHangCheckin>> hienThi(@RequestParam String maThongTinDatPhong){
        return ResponseEntity.ok(khachHangCheckinServiceIMPL.findsByMaTTDP(maThongTinDatPhong));
    }

    @PostMapping("/them")
    public ResponseEntity<KhachHangCheckin> them(@RequestBody KhachHangCheckinRequest request) {
        try {
            KhachHangCheckin created = khachHangCheckinServiceIMPL.add(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @PutMapping("sua")
    public ResponseEntity<KhachHangCheckin> sua(@RequestBody KhachHangCheckinRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(khachHangCheckinServiceIMPL.update(request));
    }

    @DeleteMapping("/xoa")
    public ResponseEntity<Void> xoa(@RequestParam Integer id) {
        try {
            boolean deleted = khachHangCheckinServiceIMPL.xoa(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("ds-luu-tru")
    public ResponseEntity<List<Object[]>> findKhachHangCheckin(@RequestParam(value="keyword", required = false) String keyword){
        return ResponseEntity.ok(khachHangCheckinServiceIMPL.findKhachHangCheckin(keyword));
    }

    @GetMapping("/danh-sach")
    public ResponseEntity<List<KhachHangCheckin>> findByTrangThaiTTDP(){
        return ResponseEntity.ok(khachHangCheckinServiceIMPL.findByTrangThaiTTDP());
    }

    @GetMapping("/thong-tin-dat-phong/{id}")
    public ResponseEntity<List<KhachHangCheckin>> getByThongTinDatPhongId(@PathVariable int id) {
        List<KhachHangCheckin> danhSach = khachHangCheckinServiceIMPL.findByThongTinDatPhongId(id);
        return ResponseEntity.ok(danhSach);
    }
}
