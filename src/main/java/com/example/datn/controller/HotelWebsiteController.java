package com.example.datn.controller;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.HotelWebsiteService;
import com.example.datn.service.IMPL.DatPhongServiceIMPL;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
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

@RestController
@RequestMapping("/api")
public class HotelWebsiteController {
    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;
    @Autowired
    DatPhongServiceIMPL datPhongServiceIMPL;
    @Autowired
    ThongTinDatPhongServiceIMPL thongTinDatPhongServiceIMPL;
    @Autowired
    HotelWebsiteService hotelWebsiteService;

    @GetMapping("/loai-phong")
    public ResponseEntity<?> home(){
        List<LoaiPhong> lp = loaiPhongServiceIMPL.getAll();
        return ResponseEntity.ok(lp);
    }

    @GetMapping("/loai-phong/getAnhLP/{idLoaiPhong}")
    public ResponseEntity<?> getAnhLP(@PathVariable int idLoaiPhong){
        List<HinhAnh> lp = loaiPhongServiceIMPL.getAnhLP(idLoaiPhong);
        return ResponseEntity.ok(lp);
    }
}
