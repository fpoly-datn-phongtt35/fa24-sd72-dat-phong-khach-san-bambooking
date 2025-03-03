package com.example.datn.controller;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.request.VatTuLoaiPhongRequest;
import com.example.datn.model.DichVuDiKem;
import com.example.datn.service.ViewPhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin("*")
@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ViewPhongController {
    ViewPhongService viewPhongService;

    @GetMapping("/view-phong")
    public ResponseEntity<?> searchPhong(
            @RequestParam(required = false) String tinhTrang,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<Integer> idLoaiPhong,
            @RequestParam(required = false) Integer giaMin,
            @RequestParam(required = false) Integer giaMax,
            @RequestParam(required = false) Integer soTang) {

        List<?> rooms = viewPhongService.findRoomsByCriteria(tinhTrang,keyword,idLoaiPhong,giaMin,giaMax,soTang);
        if (rooms.isEmpty()) {
            return ResponseEntity.ok("Không tìm thấy phòng nào phù hợp với tiêu chí.");
        }

        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/RoomDetail/{id}")
    public ResponseEntity<?> Detail(@PathVariable Integer id){
        return ResponseEntity.ok(viewPhongService.RoomDetail(id));
    }

    @PostMapping("/addDVDK/{idXepPhong}")
    public ResponseEntity<?> addDVDK(@PathVariable int idXepPhong) {
        return ResponseEntity.status(HttpStatus.CREATED).body(viewPhongService.addDVDKtoDVSD(idXepPhong));
    }

}
