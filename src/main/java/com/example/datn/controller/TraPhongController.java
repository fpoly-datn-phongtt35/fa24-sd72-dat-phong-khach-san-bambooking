package com.example.datn.controller;

import com.example.datn.dto.request.TraPhongRequest;
import com.example.datn.model.TraPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.service.IMPL.XepPhongServiceIMPL;
import com.example.datn.service.TraPhongService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/tra-phong")
public class TraPhongController {
    private final TraPhongService traPhongService;

    @Autowired
    XepPhongServiceIMPL xepPhongServiceIMPL;

    @GetMapping
    public ResponseEntity<?> getAllTraPhong(Pageable pageable) {
        return ResponseEntity.ok(traPhongService.getAllTraPhong(pageable));
    }

    @PostMapping
    public ResponseEntity<?> createTraPhong(@RequestBody TraPhongRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(traPhongService.createTraPhong(request));
    }

    @GetMapping("check-out")
    public ResponseEntity<List<TraPhong>> checkOut(@RequestParam("key") String key) {
        List<XepPhong> lxp = xepPhongServiceIMPL.findByKey(key);
        List<TraPhong> ltp = new ArrayList<>();
        for (XepPhong xp : lxp) {
            TraPhong traPhong = traPhongService.checkOut(xp.getThongTinDatPhong().getMaThongTinDatPhong());
            if (traPhong != null) {
                ltp.add(traPhong);
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(ltp);
    }

    @GetMapping("Check-out")
    public ResponseEntity<TraPhong> checkOut(@RequestParam("idTraPhong") Integer idTraPhong) {
        return ResponseEntity.status(HttpStatus.OK).body(traPhongService.CheckOut(idTraPhong));
    }

    @GetMapping("thong-tin-tra-phong")
    public ResponseEntity<?> DSTraPhong () {
        return ResponseEntity.ok(traPhongService.DSTraPhong());
    }
}
