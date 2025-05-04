package com.example.datn.controller;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.request.ToHopRequest;
import com.example.datn.dto.response.*;
import com.example.datn.dto.response.datphong.ToHopPhongPhuHop;
import com.example.datn.model.*;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.model.DichVu;
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
    @Autowired
    XepPhongServiceIMPL xepPhongServiceIMPL;
    @Autowired
    DatPhongRepository datPhongRepository;
    @Autowired
    DichVuServiceIMPL dichVuServiceIMPL;

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
    public List<DatPhong> getDPbyTDN(@RequestParam("tenDangNhap") String tenDangNhap,
                                             @RequestParam(value = "keyword", required = false) String keyword,
                                             @RequestParam(value = "ngayNhanPhong", required = false) LocalDate ngayNhanPhong,
                                             @RequestParam(value = "ngayTraPhong", required = false) LocalDate ngayTraPhong) {
        return hotelWebsiteServiceImpl.getDPbyTenDangNhap(tenDangNhap,keyword,ngayNhanPhong,ngayTraPhong);
    }

    @GetMapping("/dp/findByidDatPhong")
    public List<ThongTinDatPhong> getTTDPBymaDatPhong(@RequestParam(value = "idDatPhong") Integer idDatPhong) {
        return thongTinDatPhongServiceIMPL.getAllByIDDP(idDatPhong);
    }

    @GetMapping("/dp/findByidDPandidLP")
    public List<ThongTinDatPhong> getByidDPandidLP(@RequestParam(value = "idDatPhong") Integer idDatPhong,@RequestParam(value = "idLoaiPhong") Integer idLoaiPhong) {
        return thongTinDatPhongServiceIMPL.getByidDPandidLP(idDatPhong,idLoaiPhong);
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
    @GetMapping("/tthd/list-vat-tu-hong-thieu/{idHoaDon}")
    public ResponseEntity<?> getListVatTuHongOrThieu(@PathVariable("idHoaDon") Integer idHoaDon) {
        List<KiemTraVatTuResponseList> result = thongTinHoaDonService.getListVatTuHongOrThieuByHoaDon(idHoaDon);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/ttdp/phong-da-xep")
    public ResponseEntity<XepPhong> phongDaXep(@RequestParam("maThongTinDatPhong") String maThongTinDatPhong){
        return ResponseEntity.status(HttpStatus.OK).body(xepPhongServiceIMPL.getByMaTTDP(maThongTinDatPhong));
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

    @PutMapping("/kh/update-kh")
    public ResponseEntity<?> updateKhachHang(@RequestBody KhachHangDatPhongRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelWebsiteServiceImpl.updateKhachHang(request));
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

    @GetMapping("/loai-phong/loai-phong-kha-dung-list")
    public ResponseEntity<?> getLPKDRL (@RequestParam(value = "ngayNhanPhong")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
                                        @RequestParam(value = "ngayTraPhong")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong){
        return ResponseEntity.ok(loaiPhongServiceIMPL.getAllLPKDR(ngayNhanPhong,ngayTraPhong));
    }

    @GetMapping("/loai-phong/lpkdr-list")
    public ResponseEntity<?> getLPKDRL (@RequestParam(value = "ngayNhanPhong")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
                                        @RequestParam(value = "ngayTraPhong")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong,
                                        @RequestParam("soNguoi") Integer soNguoi,
                                        @RequestParam("soPhong") Integer soPhong,
                                        @RequestParam(value = "idLoaiPhong", required = false) Integer idLoaiPhong){
        return ResponseEntity.ok(loaiPhongServiceIMPL.getLoaiPhongKhaDungResponseList(ngayNhanPhong,ngayTraPhong,soNguoi,soPhong,idLoaiPhong));
    }

    // Những đường dẫn không yêu cầu xác thực/////////////////////
    @GetMapping("/tra-cuu/search-lich-su-dp")
    public void tracuuLichSuDP(@RequestParam("keyword") String keyword){
         hotelWebsiteServiceImpl.tracuuLichSuDP(keyword);
    }

    @GetMapping("/tra-cuu/lich-su-dp")
    public  ResponseEntity<List<DatPhong>> getLichsuDP(@RequestParam("email") String email){
        return ResponseEntity.ok(hotelWebsiteServiceImpl.getLichSuDPbyEmail(email));
    }

    @GetMapping("/tra-cuu/dp/findByidDatPhong")
    public List<ThongTinDatPhong> getTTDPBymaDatPhong2(@RequestParam(value = "idDatPhong") Integer idDatPhong) {
        return thongTinDatPhongServiceIMPL.getAllByIDDP(idDatPhong);
    }

    @GetMapping("/tra-cuu/ttdp/phong-da-xep")
    public ResponseEntity<XepPhong> phongDaXep2(@RequestParam("maThongTinDatPhong") String maThongTinDatPhong){
        return ResponseEntity.status(HttpStatus.OK).body(xepPhongServiceIMPL.getByMaTTDP(maThongTinDatPhong));
    }

    @GetMapping("/tra-cuu/dp/findByidDPandidLP")
    public List<ThongTinDatPhong> getByidDPandidLP2(@RequestParam(value = "idDatPhong") Integer idDatPhong,@RequestParam(value = "idLoaiPhong") Integer idLoaiPhong) {
        return thongTinDatPhongServiceIMPL.getByidDPandidLP(idDatPhong,idLoaiPhong);
    }

    @GetMapping("/tra-cuu/hoa-don/{idHoaDon}")
    public ResponseEntity<?> getHoaDonById2(@PathVariable("idHoaDon") Integer idHoaDon){
        return ResponseEntity.ok(hoaDonService.getOneHoaDon(idHoaDon));
    }

    @GetMapping("/tra-cuu/tthd/{idHoaDon}")
    public ResponseEntity<?> findThongTinHoaDonByHoaDonId2(@PathVariable("idHoaDon") Integer idHoaDon) {
        return ResponseEntity.status(HttpStatus.OK).body(thongTinHoaDonService.getThongTinHoaDonByHoaDonId(idHoaDon));
    }

    @GetMapping("/tra-cuu/tthd/phu-thu/{idHoaDon}")
    public ResponseEntity<?> getPhuThu2(@PathVariable("idHoaDon") Integer idHoaDon) {
        List<PhuThuResponse> phuThuResponses = thongTinHoaDonService.getPhuThu(idHoaDon);
        return ResponseEntity.ok(phuThuResponses);
    }

    @GetMapping("/tra-cuu/tthd/dich-vu-su-dung/{idHoaDon}")
    public ResponseEntity<?> getDichVuSuDung2(@PathVariable("idHoaDon") Integer idHoaDon) {
        List<DichVuSuDungResponse> dichVuSuDung = thongTinHoaDonService.getDichVuSuDung(idHoaDon);
        return ResponseEntity.ok(dichVuSuDung);
    }
    @GetMapping("/tra-cuu/tthd/list-vat-tu-hong-thieu/{idHoaDon}")
    public ResponseEntity<?> getListVatTuHongOrThieu2(@PathVariable("idHoaDon") Integer idHoaDon) {
        List<KiemTraVatTuResponseList> result = thongTinHoaDonService.getListVatTuHongOrThieuByHoaDon(idHoaDon);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/tra-cuu/hoa-don/findidHD/{idDatPhong}")
    public ResponseEntity<?> getidHDByidDatPhong2(@PathVariable("idDatPhong") Integer idDatPhong) {
        return ResponseEntity.ok( hotelWebsiteServiceImpl.getHDByidDatPhong(idDatPhong));
    }

    @GetMapping("/dp/gui-email-xac-nhan-dp")
    public void guiEmailXacNhandp(@RequestParam("idDatPhong") Integer idDatPhong){
         hotelWebsiteServiceImpl.guiEmailXacNhandp(idDatPhong);
    }

    @GetMapping("/dp/gui-email-xac-nhan-dp-sau-UD-KH")
    public void guiEmailXacNhandpsauUDKH(@RequestParam("idDatPhong") Integer idDatPhong){
        hotelWebsiteServiceImpl.guiEmailXacNhandpsauUDKhachHang(idDatPhong);
    }

    @GetMapping("/dp/xac-nhan-dp")
    public ResponseEntity<ResponseDTO> xacNhanDP(@RequestParam("iddp") Integer iddp) {
        try {
            DatPhong datPhong = datPhongRepository.findById(iddp)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt phòng với ID: " + iddp));

            if (datPhong.getTrangThai().equals("Đã xác nhận")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ResponseDTO(false, "Đặt phòng đã được xác nhận trước đó", null));
            }

            if (!datPhong.getTrangThai().equals("Chưa xác nhận")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseDTO(false, "Đặt phòng không ở trạng thái có thể xác nhận", null));
            }

            datPhong.setTrangThai("Đã xác nhận");
            datPhongRepository.save(datPhong);
            return ResponseEntity.ok(new ResponseDTO(true, "Xác nhận đặt phòng thành công", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(false, "Lỗi server: " + e.getMessage(), null));
        }
    }


    @GetMapping("/dp/email-dp-thanh-cong")
    public void emailDatPhongThanhCong(@RequestParam("iddp") Integer iddp){
        hotelWebsiteServiceImpl.emailDatPhongThanhCong(iddp);
    }

    @GetMapping("/dich_vu")
    public List<DichVu> dichVuHome() {
        return dichVuServiceIMPL.getAll();
    }

    @GetMapping("/ttdp/TTDP-Co-The-Huy")
    public ResponseEntity<?> dsTTDPCoTheHuy(@RequestParam("idDatPhong") Integer iddp) {
        return ResponseEntity.ok( hotelWebsiteServiceImpl.dsTTDPcothehuy(iddp));
    }

    @GetMapping("/dp/huy-dat-phong")
    public void huyDP(@RequestParam("idDatPhong") Integer iddp) {
        hotelWebsiteServiceImpl.huyDPandTTDP(iddp);
    }

    @GetMapping("/ttdp/huy-ttdp2")
    public void huyTTDP2(@RequestParam("idTTDP") Integer idTTDP) {
        hotelWebsiteServiceImpl.huyTTDP(idTTDP);
    }

    @GetMapping("/dp/email-xac-nhan-huy-dp")
    public void emailXacNhanHuydp(@RequestParam("idDatPhong") Integer idDatPhong){
        hotelWebsiteServiceImpl.guiEmailXacNhanHuyDP(idDatPhong);
    }

    @GetMapping("/ttdp/email-xac-nhan-huy-ttdp")
    public void emailXacNhanHuyTTDP(@RequestParam("idTTDP") Integer idTTDP){
        hotelWebsiteServiceImpl.guiEmailXacNhanHuyTTDP(idTTDP);
    }
}

