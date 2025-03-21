package com.example.datn.service.IMPL;

import com.example.datn.dto.request.TraPhongRequest;
import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.RoomNotCheckedException;
import com.example.datn.model.*;
import com.example.datn.repository.KiemTraPhongRepository;
import com.example.datn.repository.TraPhongRepository;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.service.TraPhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TraPhongServiceImpl implements TraPhongService {
    TraPhongRepository traPhongRepository;
    XepPhongRepository xepPhongRepository;
    KiemTraPhongRepository kiemTraPhongRepository;

    @Override
    public Page<TraPhongResponse> getAllTraPhong(Pageable pageable) {
        return traPhongRepository.findAll(pageable)
                .map(this::convertToTraPhongResponse);
    }

    @Override
    public TraPhongResponse createTraPhong(TraPhongRequest request) {
        XepPhong xepPhong = xepPhongRepository.findById(request.getIdXepPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xếp phòng"));

        TraPhong traPhong = new TraPhong();
        traPhong.setXepPhong(xepPhong);
        traPhong.setNgayTraThucTe(LocalDateTime.now());
        traPhong.setTrangThai(true);

        return convertToTraPhongResponse(traPhongRepository.save(traPhong));
    }

    @Override
    public TraPhong checkOut(String maThongTinDatPhong) {
        TraPhong traPhong = new TraPhong();
        XepPhong xepPhong = xepPhongRepository.getByMaTTDP(maThongTinDatPhong);
        traPhong.setXepPhong(xepPhong);
        traPhong.setNgayTraThucTe(LocalDateTime.now());
        traPhong.setTrangThai(false);
        traPhongRepository.save(traPhong);
        return traPhong;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public TraPhong CheckOut(Integer idTraPhong) {
        TraPhong traPhong = traPhongRepository.findById(idTraPhong)
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy trả phòng có id: " + idTraPhong));

        XepPhong xepPhong = traPhong.getXepPhong();
        String maDatPhong = xepPhong.getThongTinDatPhong().getDatPhong().getMaDatPhong();

        List<Object[]> unverifiedRooms = kiemTraPhongRepository.findUnverifiedRooms(maDatPhong);
        if (!unverifiedRooms.isEmpty()) {
            List<String> roomNames = unverifiedRooms.stream()
                    .map(room -> String.valueOf(room[1])).toList();
            throw new RoomNotCheckedException("Danh sách phòng chưa kiểm tra: "
                                              + roomNames + ", nhân viên vui lòng kiểm tra phòng trước khi trả phòng!");
        }

        System.out.println("Danh sách phòng chưa kiểm tra: " + unverifiedRooms);

        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        DatPhong datPhong = xepPhong.getThongTinDatPhong().getDatPhong();
        Phong p = xepPhong.getPhong();

        thongTinDatPhong.setTrangThai("Da tra phong");
        datPhong.setTrangThai("Đã trả phòng");
        xepPhong.setTrangThai(false);

        traPhong.setTrangThai(true);
        traPhongRepository.save(traPhong);
        return traPhong;
    }

    @Override
    public List<TraPhong> DSTraPhong() {
        return traPhongRepository.findAll();
    }

    private TraPhongResponse convertToTraPhongResponse(TraPhong traPhong) {
        XepPhong xepPhong = traPhong.getXepPhong();
        return new TraPhongResponse(
                traPhong.getId(),
                xepPhong.getId(),
                traPhong.getNgayTraThucTe(),
                traPhong.getTrangThai()
        );
    }


}
