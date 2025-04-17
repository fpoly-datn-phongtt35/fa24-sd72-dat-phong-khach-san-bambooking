package com.example.datn.controller;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.request.ToHopRequest;
import com.example.datn.dto.response.*;
import com.example.datn.dto.response.datphong.ToHopPhongPhuHop;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.KhachHang;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.*;
import com.example.datn.service.IMPL.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
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
    HotelWebsiteServiceImpl hotelWebsiteServiceImpl;
    @Autowired
    HoaDonService hoaDonService;
    @Autowired
    ThongTinHoaDonService thongTinHoaDonService;
    @Autowired
    KhachHangService khachHangService;
    @Autowired
    KhachHangServiceIMPL khachHangServiceIMPL;

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

    @GetMapping("/dp/lich-su-dp")
    public Page<ThongTinDatPhong> getDPbyTDN(@RequestParam("tenDangNhap") String tenDangNhap,  Pageable pageable) {
        return hotelWebsiteServiceImpl.getDPbyTenDangNhap(tenDangNhap,pageable);
    }

    @GetMapping("/dp/findByidDatPhong")
    public List<ThongTinDatPhong> getTTDPBymaDatPhong(@RequestParam(value = "idDatPhong") Integer idDatPhong) {
        return thongTinDatPhongServiceIMPL.getAllByIDDP(idDatPhong);
    }

    @GetMapping("/hoa-don/{idHoaDon}")
    public ResponseEntity<?> getHoaDonById(@PathVariable("idHoaDon") Integer idHoaDon){
        return ResponseEntity.ok(hoaDonService.getOneHoaDon(idHoaDon));
    }

    @GetMapping("/tthd/{idHoaDon}")
    public ResponseEntity<?> findThongTinHoaDonByHoaDonId(@PathVariable("idHoaDon") Integer idHoaDon) {
        return ResponseEntity.status(HttpStatus.OK).body(thongTinHoaDonService.getThongTinHoaDonByHoaDonId(idHoaDon));
    }

    @GetMapping("/tthd/phu-thu/{idHoaDon}")
    public ResponseEntity<?> getPhuThu(@PathVariable("idHoaDon") Integer idHoaDon) {
        List<PhuThuResponse> phuThuResponses = thongTinHoaDonService.getPhuThu(idHoaDon);
        return ResponseEntity.ok(phuThuResponses);
    }

    @GetMapping("/tthd/dich-vu-su-dung/{idHoaDon}")
    public ResponseEntity<?> getDichVuSuDung(@PathVariable("idHoaDon") Integer idHoaDon) {
        List<DichVuSuDungResponse> dichVuSuDung = thongTinHoaDonService.getDichVuSuDung(idHoaDon);
        return ResponseEntity.ok(dichVuSuDung);
    }

    @GetMapping("/hoa-don/findidHD/{idDatPhong}")
    public ResponseEntity<?> getidHDByidDatPhong(@PathVariable("idDatPhong") Integer idDatPhong) {
        return ResponseEntity.ok( hotelWebsiteServiceImpl.getHDByidDatPhong(idDatPhong));
    }

    @PostMapping("/dp/to-hop-loai-phong-kha-dung")
    public ResponseEntity<Page<ToHopPhongPhuHop>> toHopLoaiPhongKhaDung(
            @RequestBody ToHopRequest request,
            @PageableDefault(size = 5) Pageable pageable) {
        Page<ToHopPhongPhuHop> p = loaiPhongServiceIMPL.getToHopPhongPhuHop(
                request.getNgayNhanPhong(),
                request.getNgayTraPhong(),
                request.getSoNguoi(),
                request.getKey(),
                request.getTongChiPhiMin(),
                request.getTongChiPhiMax(),
                request.getTongSoPhongMin(),
                request.getTongSoPhongMax(),
                request.getTongSucChuaMin(),
                request.getTongSucChuaMax(),
                request.getLoaiPhongChons(),
                pageable
        );
        return ResponseEntity.ok(p);
    }

    @PostMapping("/kh/create-kh-dp")
    public ResponseEntity<?> createKhachHangDatPhong(@RequestBody KhachHangDatPhongRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangService.createKhachHangDatPhong(request));
    }

    @PostMapping("/dp/them-moi")
    public ResponseEntity<DatPhongResponse> createDatPhong(@RequestBody DatPhongRequest datPhongRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(datPhongServiceIMPL.addDatPhong(datPhongRequest));
    }

    @PostMapping("/ttdp/them-moi")
    public ResponseEntity<ThongTinDatPhong> createDatPhong(@RequestBody TTDPRequest request) {
        ThongTinDatPhong ttdp = thongTinDatPhongServiceIMPL.add(request);
        if (ttdp != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ttdp);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/kh/update-kh-dp")
    public ResponseEntity<?> updateKhachHangDatPhong(@RequestBody KhachHangDatPhongRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangService.updateKhachHangDatPhong(request));
    }

    @PutMapping("/dp/cap-nhat")
    public ResponseEntity<?> updateDatPhong(@RequestBody DatPhongRequest datPhongRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(datPhongServiceIMPL.updateDatPhong(datPhongRequest));
    }

    @GetMapping("/ttdp/hien-thi-by-iddp")
    public List<ThongTinDatPhong> getByIDDP(@RequestParam(value = "idDP") Integer idDP) {
        return thongTinDatPhongServiceIMPL.getByIDDP(idDP);
    }

    @PutMapping("/ttdp/sua")
    public ResponseEntity<ThongTinDatPhong> updateDatPhong(@RequestBody TTDPRequest request) {
        ThongTinDatPhong ttdp = thongTinDatPhongServiceIMPL.update(request);
        if (ttdp != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ttdp);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    @GetMapping("/ttdp/huy-ttdp")
    public ThongTinDatPhong huyTTDP(@RequestParam String maThongTinDatPhong) {
        return thongTinDatPhongServiceIMPL.huyTTDP(maThongTinDatPhong);
    }

    @DeleteMapping("/dp/xoa")
    public ResponseEntity<?> xoaDatPhong(@RequestParam Integer iddp) {
        try {
            datPhongServiceIMPL.xoaDatPhong(iddp);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Đặt phòng không tồn tại.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi trong quá trình xóa đặt phòng.");
        }
    }

    @DeleteMapping("/kh/delete-kh-dp")
    public ResponseEntity<?> deleteKhachHangDatPhong(@RequestParam Integer kh) {
        try {
            khachHangService.deleteKhachHangDatPhong(kh);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Khách hàng không tồn tại.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi trong quá trình xóa khách hàng.");
        }
    }


    @GetMapping("/kh/get-by-username")
    public ResponseEntity<?> getKhachHangByUsername(@RequestParam(value = "userName", required = false) String userName){
        KhachHang kh = khachHangServiceIMPL.getKHByUsername(userName);
        return ResponseEntity.status(HttpStatus.OK).body(kh);
    }

}

