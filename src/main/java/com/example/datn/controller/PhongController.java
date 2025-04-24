package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.dto.request.PhongRequest;
import com.example.datn.service.IMPL.PhongServiceIMPL;
import com.example.datn.service.PhongService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/phong")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PhongController {

    PhongService phongService;
    PhongServiceIMPL phongServiceIMPL;

    @GetMapping("")
    public ResponseEntity<?> getAllPhong(Pageable pageable) {
        return ResponseEntity.ok(phongService.getAllPhong(pageable));
    }

    @PostMapping("")
    public ResponseEntity<?> createPhong(@RequestBody @Valid PhongRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phongService.createPhong(request));
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getOneRoom(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(phongService.getOnePhong(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePhong(@PathVariable("id") Integer id, @RequestBody @Valid PhongRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(phongService.updatePhong(id, request));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateStatusRoom(@PathVariable("id") Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(phongService.updateStatus(id));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPhong(@RequestParam(value = "keyword", required = false) String keyword,
                                         Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(phongService.searchPhong(keyword, pageable));
    }

    @GetMapping("/phong-kha-dung")
    public ResponseEntity<?> searchPhongKhaDung(@RequestParam Integer idLoaiPhong,
                                                @RequestParam LocalDate ngayNhanPhong,
                                                @RequestParam LocalDate ngayTraPhong) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(phongServiceIMPL.searchPhongKhaDung(idLoaiPhong, ngayNhanPhong, ngayTraPhong));
    }

    @GetMapping("/dsphong")
    public ResponseEntity<?> dsPhong(@RequestParam(value = "keyword", required = false) String keyword) {
        return ResponseEntity.status(HttpStatus.OK).body(phongService.DSPhong(keyword));
    }

    @GetMapping("/phong-dang-dat")
    public ResponseEntity<?> phongDangDat(@RequestParam(value = "idPhong", required = false) Integer idPhong) {
        return ResponseEntity.status(HttpStatus.OK).body(phongServiceIMPL.phongDangDat(idPhong));
    }

    @GetMapping("/huy-phong-dang-dat")
    public ResponseEntity<?> huyDangDat(@RequestParam(value = "idPhong", required = false) Integer idPhong) {
        return ResponseEntity.status(HttpStatus.OK).body(phongServiceIMPL.huyDangDat(idPhong));
    }

    @PatchMapping("/change-condition-room/{id}")
    public ResponseData<String> changeConditionRoom(@PathVariable Integer id) {
        String result = phongServiceIMPL.changeConditionRoom(id);
        return new ResponseData<>(
                HttpStatus.ACCEPTED.value(),
                result
        );
    }

    @PatchMapping("/change-all-condition-room/{id}")
    public ResponseData<String> changeAllConditionRoom(@PathVariable Integer id) {
        String result = phongServiceIMPL.changeAllConditionRoom(id);
        return new ResponseData<>(
                HttpStatus.ACCEPTED.value(),
                result
        );
    }
}
