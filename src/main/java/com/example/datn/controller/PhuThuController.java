package com.example.datn.controller;

import com.example.datn.dto.request.PhuThuRequest;
import com.example.datn.model.PhuThu;
import com.example.datn.service.IMPL.PhuThuServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/phu_thu")
public class PhuThuController {
    @Autowired
    PhuThuServiceIMPL phuThuServiceIMPL;

    @PostMapping("add")
    public ResponseEntity<?> addPhuThu(@RequestBody PhuThuRequest phuThuRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phuThuServiceIMPL.addPhuThu(phuThuRequest));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePhuThu(@RequestBody PhuThuRequest phuThuRequest) {
        PhuThu updatedPhuThu = phuThuServiceIMPL.updatePhuThu(phuThuRequest);
        return ResponseEntity.ok(updatedPhuThu);
    }

    @GetMapping("/check/{idXepPhong}")
    public ResponseEntity<?> checkIfPhuThuExists(@PathVariable Integer idXepPhong) {
        PhuThu existingPhuThu = phuThuServiceIMPL.checkIfPhuThuExists(idXepPhong);
        if (existingPhuThu != null) {
            return ResponseEntity.ok(existingPhuThu);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phụ thu nào cho xếp phòng này");
        }
    }

}
