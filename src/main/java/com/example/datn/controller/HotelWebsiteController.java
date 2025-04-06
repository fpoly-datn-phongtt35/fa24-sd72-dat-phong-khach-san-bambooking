package com.example.datn.controller;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.request.ToHopRequest;
import com.example.datn.dto.response.*;
import com.example.datn.dto.response.datphong.ToHopPhongPhuHop;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.HoaDonService;
import com.example.datn.service.HotelWebsiteService;
import com.example.datn.service.IMPL.DatPhongServiceIMPL;
import com.example.datn.service.IMPL.HotelWebsiteServiceImpl;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
import com.example.datn.service.LoaiPhongService;
import com.example.datn.service.ThongTinHoaDonService;
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
        LocalDateTime ngayNhanPhongLocal = request.getNgayNhanPhong() != null
                ? ZonedDateTime.parse(request.getNgayNhanPhong()).toLocalDateTime()
                : null;
        LocalDateTime ngayTraPhongLocal = request.getNgayTraPhong() != null
                ? ZonedDateTime.parse(request.getNgayTraPhong()).toLocalDateTime()
                : null;
        Page<ToHopPhongPhuHop> p = loaiPhongServiceIMPL.getToHopPhongPhuHop(
                ngayNhanPhongLocal,
                ngayTraPhongLocal,
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
}
