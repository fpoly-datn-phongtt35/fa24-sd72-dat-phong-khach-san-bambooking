package com.example.datn.service.IMPL;

import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.service.ThongTinDatPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ThongTinDatPhongServiceIMPL implements ThongTinDatPhongService {
    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;


    @Override
    public ThongTinDatPhong add(TTDPRequest request) {
        return null;
    }

    @Override
    public Page<ThongTinDatPhong> getAll(Pageable pageable) {
        return thongTinDatPhongRepository.findAll(pageable);
    }

    @Override
    public Page<ThongTinDatPhong> getByIDDP(Integer iddp, Pageable pageable) {
        return thongTinDatPhongRepository.findByDatPhongId(iddp,pageable);
    }
}
