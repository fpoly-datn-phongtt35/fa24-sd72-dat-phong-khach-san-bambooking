package com.example.datn.service.IMPL;

import com.example.datn.dto.response.PhongResponse;
import com.example.datn.mapper.PhongMapper;
import com.example.datn.model.Phong;
import com.example.datn.repository.ViewPhongRepository;
import com.example.datn.service.ViewPhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ViewPhongImpl implements ViewPhongService {
    ViewPhongRepository viewPhongRepository;
    PhongMapper phongMapper;
    @Override
    public List<PhongResponse> findRoomsByCriteria(String tinhTrang, String keyword) {
        List<Phong> phongList = viewPhongRepository.findByCriteria(tinhTrang,   keyword);

        // Sử dụng phongMapper để ánh xạ từ Phong sang PhongResponse
        return phongList.stream()
                .map(phongMapper::toPhongResponse)
                .collect(Collectors.toList());
    }


}
