package com.example.datn.service.IMPL;

import com.example.datn.dto.request.PhongRequest;
import com.example.datn.dto.response.PhongResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.mapper.PhongMapper;
import com.example.datn.model.*;
import com.example.datn.repository.*;
import com.example.datn.service.PhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PhongServiceIMPL implements PhongService {
    PhongRepository phongRepository;
    LoaiPhongRepository loaiPhongRepository;
    PhongMapper phongMapper;
    DatPhongRepository datPhongRepository;
    ThongTinDatPhongRepository thongTinDatPhongRepository;
    XepPhongRepository xepPhongRepository;

    @Override
    public Page<Phong> getAllPhong(Pageable pageable) {
        return phongRepository.findAll(pageable);
    }

    @Override
    public Phong createPhong(PhongRequest request) {
        LoaiPhong loaiPhong = loaiPhongRepository.findById(request.getIdLoaiPhong())
                .orElseThrow(() -> new RuntimeException("ID type room not found: " + request.getIdLoaiPhong()));
        Phong phong = phongMapper.toPhong(request);
        phong.setLoaiPhong(loaiPhong);
        return phongRepository.save(phong);
    }

    @Override
    public PhongResponse getOnePhong(Integer id) {
        Phong phong = phongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID not found: " + id));
        return phongMapper.toPhongResponse(phong);
    }

    @Override
    public PhongResponse updatePhong(Integer id, PhongRequest request) {
        Phong phong = phongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID not found: " + id));

        if (request.getIdLoaiPhong() != null) {
            LoaiPhong loaiPhong = loaiPhongRepository.findById(request.getIdLoaiPhong())
                    .orElseThrow(() -> new RuntimeException("ID type room not found: " + id));
            phong.setLoaiPhong(loaiPhong);
        }

        phong.setMaPhong(request.getMaPhong());
        phong.setTenPhong(request.getTenPhong());
        phong.setTinhTrang(request.getTinhTrang());
        phong.setTrangThai(request.getTrangThai());
        phong = phongRepository.save(phong);
        return phongMapper.toPhongResponse(phong);
    }

    @Override
    public Boolean updateStatus(Integer id) {
        Phong phong = phongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID room not found: " + id));
        if (phong.getTrangThai()){
            phong.setTrangThai(false);
        }else {
            phong.setTrangThai(true);
        }
        phongRepository.save(phong);
        return true;
    }

    @Override
    public Page<Phong> searchPhong(String keyword, Pageable pageable) {
        return phongRepository.search(keyword, pageable);
    }

    @Override
    public List<Phong> searchPhongKhaDung(Integer idLoaiPhong, LocalDate ngayNhanPhong, LocalDate ngayTraPhong) {
        List<String> trangThai = Arrays.asList("Đang ở","Đã xếp","Đã kiểm tra");
        List<String> tinhTrang = Arrays.asList("Trống","Đang đặt");
        return phongRepository.searchPhongKhaDung(idLoaiPhong,ngayNhanPhong,ngayTraPhong,trangThai,tinhTrang);
    }

    @Override
    public String changeConditionRoom(Integer id) {
        Phong phong = phongRepository.findById(id)
                .orElseThrow(()-> new EntityNotFountException("Room id not found: " + id));
        phong.setTinhTrang("Cần kiểm tra");
        phongRepository.save(phong);

        return "Thay đổi tình trạng phòng thành công: " + phong.getTenPhong() + " ,tình trạng phòng: " + phong.getTinhTrang();
    }

    @Transactional
    @Override
    public String changeAllConditionRoom(Integer id) {
        log.info("======== Change All Condition Room =======");
        DatPhong datPhong = datPhongRepository.findById(id)
                .orElseThrow(()-> new EntityNotFountException("id DatPhong not found: " + id));

        List<ThongTinDatPhong> thongTinDatPhongs = thongTinDatPhongRepository.findByDatPhong_Id(id);
        if (thongTinDatPhongs.isEmpty()){
            return "Không tìm thấy thông tin đặt phòng của đơn đặt phòng: " + id;
        }

        List<XepPhong> xepPhongs = new ArrayList<>();
        for (ThongTinDatPhong ttdp : thongTinDatPhongs) {
            List<XepPhong> xepPhongList = xepPhongRepository.findByThongTinDatPhongId(ttdp.getId());
            xepPhongs.addAll(xepPhongList);
        }

        if (xepPhongs.isEmpty()){
            return "Không tìm thấy phòng nào liên quan đến đặt phòng: " + id;
        }

        int updateCount = 0;
        StringBuilder result = new StringBuilder("Kết quả thay đổi tình trạng phòng:\n");
        for (XepPhong xepPhong : xepPhongs) {
            Phong phong = phongRepository.findById(xepPhong.getPhong().getId()).orElse(null);
            if (phong != null && "Đang ở".equals(phong.getTinhTrang())){
                phong.setTinhTrang("Cần kiểm tra");
                phongRepository.save(phong);
                updateCount++;
                result.append("- Phòng ").append(phong.getTenPhong()).append("Đã đổi tình trạng thành 'Cần kiểm tra'");
            }
        }
        if (updateCount == 0){
            return "Không có phòng nào ở tình trạng 'Đang ở'.";
        }
        return result.append("Tổng cộng: ").append(updateCount)
                .append(" phòng đã được cập nhật tình trạng!").toString();
    }

    @Override
    public List<Phong> DSPhong(String keyword) {
        return phongRepository.DSPhong(keyword);
    }

    public Phong phongDangDat(Integer id){
        Phong p = phongRepository.getPhongById(id);
        p.setTinhTrang("Đang đặt");
        phongRepository.save(p);
        return p;
    }

    public Phong huyDangDat(Integer id){
        Phong p = phongRepository.getPhongById(id);
        p.setTinhTrang("Trống");
        phongRepository.save(p);
        return p;
    }
}
