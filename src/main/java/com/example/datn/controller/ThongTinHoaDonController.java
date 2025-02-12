package com.example.datn.controller;

import com.example.datn.dto.request.ThongTinHoaDonRequest;
import com.example.datn.dto.response.DichVuSuDungResponse;
import com.example.datn.repository.TraPhongRepository;
import com.example.datn.service.ThongTinHoaDonService;
import com.oracle.wls.shaded.org.apache.regexp.RE;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
//@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/thong-tin-hoa-don")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ThongTinHoaDonController {
    ThongTinHoaDonService thongTinHoaDonService;

    @GetMapping
    public ResponseEntity<?> getAllThongTinHoaDon(Pageable pageable) {
        return ResponseEntity.ok(thongTinHoaDonService.getAllThongTinHoaDon(pageable));
    }

    @GetMapping("/{idHoaDon}")
    public ResponseEntity<?> findThongTinHoaDonByHoaDonId(@PathVariable("idHoaDon") Integer idHoaDon) {
        return ResponseEntity.status(HttpStatus.OK).body(thongTinHoaDonService.getThongTinHoaDonByHoaDonId(idHoaDon));
    }

    @PostMapping
    public ResponseEntity<?> createThongTinHoaDon(@RequestBody ThongTinHoaDonRequest tthdRequest) {
        System.out.println(tthdRequest.getIdHoaDon());
        System.out.println(tthdRequest.getListTraPhong());
        return ResponseEntity.status(HttpStatus.CREATED).body(thongTinHoaDonService.createThongTinHoaDon(tthdRequest.getIdHoaDon(), tthdRequest.getListTraPhong()));
    }

    @GetMapping("/dich-vu-su-dung/{idHoaDon}")
    public ResponseEntity<?> getDichVuSuDung(@PathVariable("idHoaDon") Integer idHoaDon) {
        List<DichVuSuDungResponse> dichVuSuDung = thongTinHoaDonService.getDichVuSuDung(idHoaDon);
        return ResponseEntity.ok(dichVuSuDung);
    }
}
