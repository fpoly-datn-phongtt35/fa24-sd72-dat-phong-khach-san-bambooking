package com.example.datn.service.IMPL;

import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.RoomNotCheckedException;
import com.example.datn.model.*;
import com.example.datn.repository.*;
import com.example.datn.service.TraPhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j(topic = "TRA_PHONG_SERVICE")
public class TraPhongServiceImpl implements TraPhongService {
    TraPhongRepository traPhongRepository;
    XepPhongRepository xepPhongRepository;
    KiemTraPhongRepository kiemTraPhongRepository;
    ThongTinDatPhongRepository thongTinDatPhongRepository;
    DatPhongRepository datPhongRepository;

    @Override
    public Page<TraPhongResponse> getAllTraPhong(Pageable pageable) {
        return traPhongRepository.findAll(pageable)
                .map(this::convertToTraPhongResponse);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public TraPhong checkOutById(Integer idTraPhong) {
        log.info("================ Start checkOutById ================");
        TraPhong traPhong = traPhongRepository.findById(idTraPhong)
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy trả phòng có id: " + idTraPhong));

        XepPhong xepPhong = traPhong.getXepPhong();
        if(xepPhong == null) {
            throw new RuntimeException("Xếp phòng đang bị null cho TraPhong có ID: " + idTraPhong);
        }

        //Kiểm tra xem phòng này đã được kiểm tra hay chưa
        Optional<KiemTraPhong> kiemTraPhongOp = kiemTraPhongRepository.findByXepPhongId(xepPhong.getId());
        if (kiemTraPhongOp.isEmpty() || !"Đã kiểm tra".equals(kiemTraPhongOp.get().getTrangThai())){
            Phong phong = xepPhong.getPhong();
            if (phong == null) {
                throw new EntityNotFountException("Phong bị null cho XepPhong ID: " + xepPhong.getId());
            }
            throw new RoomNotCheckedException("Phòng: " + xepPhong.getPhong().getTenPhong() +
                                              " chưa được kiểm tra, vui lòng kiểm tra trước khi trả phòng!");
        }

        //Update status XepPhong and TraPhong
        updateXepPhongAndTraPhong(xepPhong, traPhong);

        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        if (thongTinDatPhong == null) {
            throw new EntityNotFountException("ThongTinDatPhong bị null cho XepPhong ID: " + xepPhong.getId());
        }

        List<XepPhong> allXepPhong = xepPhongRepository.findByThongTinDatPhongId(thongTinDatPhong.getId());
        boolean allRoomCheckOut = allXepPhong.stream()
                        .allMatch(xp-> "Đã trả phòng".equals(xp.getTrangThai()));

        //If all room -> tra phong => update status ThongTinDatPhong and DatPhong
        if (allRoomCheckOut) {
            DatPhong datPhong = thongTinDatPhong.getDatPhong();
            if(datPhong == null) {
                throw new EntityNotFountException("DatPhong bị null cho ThongTinDatPhong ID: " + thongTinDatPhong.getId());
            }
            updateThongTinDatPhongAndDatPhong(thongTinDatPhong, datPhong);
        }
        return traPhong;
    }

    private void updateXepPhongAndTraPhong(XepPhong xepPhong, TraPhong traPhong) {
        xepPhong.setTrangThai("Đã trả phòng");
        traPhong.setTrangThai(true);
        xepPhongRepository.save(xepPhong);
        traPhongRepository.save(traPhong);
    }

    private void updateThongTinDatPhongAndDatPhong(ThongTinDatPhong thongTinDatPhong, DatPhong datPhong) {
        thongTinDatPhong.setTrangThai("Đã trả phòng");
        datPhong.setTrangThai("Đã trả phòng");
        thongTinDatPhongRepository.save(thongTinDatPhong);
        datPhongRepository.save(datPhong);
    }

    @Override
    public List<TraPhongResponse> checkOutByKey(String key) {
        log.info("================ Start checkOutByKey ===============");
        List<String> trangThaiThongTinDatPhong = new ArrayList<>();
        trangThaiThongTinDatPhong.add("Đang ở");
        trangThaiThongTinDatPhong.add("Đã kiểm tra phòng");
        return xepPhongRepository.findByKey(key, trangThaiThongTinDatPhong).stream()
                .map(xepPhong -> {
                    Optional<TraPhong> existingTraPhong = traPhongRepository.findByXepPhong(xepPhong);
                    TraPhong traPhong;
                    if (existingTraPhong.isPresent()) {
                        traPhong = existingTraPhong.get();
                        if (traPhong.getXepPhong() == null) {
                            log.warn("TraPhong ID {} thiếu XepPhong, gán lại.", traPhong.getId());
                            traPhong.setXepPhong(xepPhong);
                            traPhong = traPhongRepository.save(traPhong);
                        }
                    } else {
                        traPhong = new TraPhong();
                        traPhong.setXepPhong(xepPhong);
                        traPhong.setNgayTraThucTe(LocalDateTime.now());
                        traPhong.setTrangThai(false);
                        traPhong = traPhongRepository.save(traPhong);
                    }

                    KiemTraPhong kiemTraPhong = kiemTraPhongRepository.findByXepPhongId(xepPhong.getId()).orElse(null);
                    return convertToTraPhongResponse(traPhong, xepPhong, kiemTraPhong);
                })
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<TraPhong> DSTraPhong() {
        return traPhongRepository.findAll();
    }

    // Gộp logic convert thành một phương thức duy nhất
    private TraPhongResponse convertToTraPhongResponse(TraPhong traPhong) {
        return convertToTraPhongResponse(traPhong, traPhong.getXepPhong(), null);
    }

    private TraPhongResponse convertToTraPhongResponse(TraPhong traPhong, XepPhong xepPhong, KiemTraPhong kiemTraPhong) {
        if (xepPhong == null) {
            throw new RuntimeException("XepPhong bị null cho TraPhong ID: " + traPhong.getId());
        }

        // Lấy KiemTraPhong nếu chưa có (cho trường hợp gọi từ checkOutByKey)
        KiemTraPhong ktp = (kiemTraPhong != null) ? kiemTraPhong : kiemTraPhongRepository.findByXepPhongId(xepPhong.getId()).orElse(null);
        String trangThaiKTP = (ktp != null) ? ktp.getTrangThai() : "Chưa kiểm tra";
        LocalDateTime thoiGianKTP = (ktp != null) ? ktp.getThoiGianKiemTra() : null;

        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        String tenPhong = xepPhong.getPhong().getTenPhong();
        LocalDate ngayNhan = thongTinDatPhong.getNgayNhanPhong();

        return new TraPhongResponse(
                traPhong.getId(),
                xepPhong.getId(),
                traPhong.getNgayTraThucTe(),
                traPhong.getTrangThai(),
                tenPhong,
                ngayNhan,
                trangThaiKTP,
                thoiGianKTP
        );
    }
}