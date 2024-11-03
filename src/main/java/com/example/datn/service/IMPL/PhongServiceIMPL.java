package com.example.datn.service.IMPL;

import com.example.datn.dto.request.PhongRequest;
import com.example.datn.dto.response.PhongResponse;
import com.example.datn.mapper.PhongMapper;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.Phong;
import com.example.datn.repository.LoaiPhongRepository;
import com.example.datn.repository.PhongRepository;
import com.example.datn.service.PhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PhongServiceIMPL implements PhongService {
    PhongRepository phongRepository;
    LoaiPhongRepository loaiPhongRepository;
    PhongMapper phongMapper;

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
    public List<Phong> searchPhongKhaDung(Integer idLoaiPhong) {
        return phongRepository.searchPhongKhaDung(idLoaiPhong);
    }


}
