package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.dto.request.KiemTraPhongRequest;
import com.example.datn.dto.response.KiemTraPhongResponse;
import com.example.datn.dto.response.NhanVienResponse;
import com.example.datn.dto.response.VatTuResponseByNVT;
import com.example.datn.dto.response.XepPhongResponse;
import com.example.datn.service.KiemTraPhongService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j(topic = "PERFORM_ROOM_CHECK_CONTROLLER")
@RestController
@RequiredArgsConstructor
@RequestMapping("/kiem-tra-phong")
public class KiemTraPhongController {

    private final KiemTraPhongService kiemTraPhongService;

    @GetMapping("/tim-kiem-xep-phong")
    public ResponseData<List<XepPhongResponse>> timKiemXepPhong(@RequestParam String key) {
        log.info("Tìm kiếm xếp phòng theo tenPhong: {}", key);

        List<XepPhongResponse> danhSach = kiemTraPhongService.timKiemXepPhong(key);
        return new ResponseData<>(HttpStatus.OK.value(), "Tìm kiếm thành công!", danhSach);
    }

    @PostMapping("/kiem-tra")
    public ResponseData<KiemTraPhongResponse> kiemTraPhong(@RequestBody KiemTraPhongRequest request) {
        log.info("Kiểm tra phòng: ID Xếp Phòng = {}, ID Nhân viên = {}",
                request.getIdXepPhong(), request.getIdNhanVien());
        KiemTraPhongResponse response = this.kiemTraPhongService.performRoomCheck(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Kiểm tra thành công!", response);
    }

    @GetMapping("/get-all-nhan-vien")
    public ResponseData<List<NhanVienResponse>> getAllNhanVien() {
        log.info("Get all nhan vien");
        return new ResponseData<>(HttpStatus.OK.value(), "Get all nhan vien", this.kiemTraPhongService.findAllNhanVien());
    }

    @GetMapping("/vat-tu/{idXepPhong}")
    public ResponseData<List<VatTuResponseByNVT>> getVatTuTheoPhong(@PathVariable Integer idXepPhong) {
        List<VatTuResponseByNVT> listVatTu = kiemTraPhongService.getVatTuByXepPhong(idXepPhong);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Get list materials successfully!", listVatTu);
    }

}
