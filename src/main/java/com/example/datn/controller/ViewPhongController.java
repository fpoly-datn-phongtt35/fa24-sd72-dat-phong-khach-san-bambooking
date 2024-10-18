package com.example.datn.controller;

import com.example.datn.service.ViewPhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ViewPhongController {
    ViewPhongService viewPhongService;

    @GetMapping("/view-phong")
    public ResponseEntity<?> searchPhong(
            @RequestParam(required = false) String tinhTrang,
            @RequestParam(required = false) Double giaMin,
            @RequestParam(required = false) Double giaMax,
            @RequestParam(required = false) String keyword) {
        if (giaMin != null && giaMax != null && giaMax < giaMin) {
            return ResponseEntity.badRequest().body("Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu.");
        }

        List<?> rooms = viewPhongService.findRoomsByCriteria(tinhTrang, giaMin, giaMax, keyword);
        if (rooms.isEmpty()) {
            return ResponseEntity.ok("Không tìm thấy phòng nào phù hợp với tiêu chí.");
        }

        return ResponseEntity.ok(rooms);
    }
}
