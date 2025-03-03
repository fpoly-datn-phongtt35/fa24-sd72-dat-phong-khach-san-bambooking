package com.example.datn.service.IMPL;

import com.example.datn.dto.request.TraPhongRequest;
import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.mapper.TraPhongMapper;
import com.example.datn.model.Phong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.TraPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.TraPhongRepository;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.service.TraPhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TraPhongServiceImpl implements TraPhongService {
    TraPhongRepository traPhongRepository;
    XepPhongRepository xepPhongRepository;
    TraPhongMapper traPhongMapper;

    @Override
    public Page<TraPhongResponse> getAllTraPhong(Pageable pageable) {
        return traPhongRepository.findAll(pageable)
                .map(traPhongMapper::toTraPhongResponse);
    }

    @Override
    public TraPhongResponse createTraPhong(TraPhongRequest request) {
        XepPhong xepPhong = xepPhongRepository.findById(request.getIdXepPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xếp phòng"));
        TraPhong traPhong = traPhongMapper.toTraPhong(request, xepPhong);
        return traPhongMapper.toTraPhongResponse(traPhongRepository.save(traPhong));
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

    @Override
    public TraPhong CheckOut(Integer idTraPhong) {
        TraPhong traPhong = traPhongRepository.findById(idTraPhong).get();
        XepPhong xepPhong = traPhong.getXepPhong();
        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        Phong p = xepPhong.getPhong();

        thongTinDatPhong.setTrangThai("Da tra phong");
        xepPhong.setTrangThai(false);
        p.setTinhTrang("available");
        traPhong.setTrangThai(true);
        traPhongRepository.save(traPhong);
        return traPhong;
    }
}
