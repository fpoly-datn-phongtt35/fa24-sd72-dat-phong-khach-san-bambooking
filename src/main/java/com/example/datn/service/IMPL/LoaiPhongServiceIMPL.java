package com.example.datn.service.IMPL;

import com.example.datn.model.LoaiPhong;
import com.example.datn.repository.LoaiPhongRepository;
import com.example.datn.service.LoaiPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LoaiPhongServiceIMPL implements LoaiPhongService {

    @Autowired
    LoaiPhongRepository loaiPhongRepository;

    @Override
    public List<LoaiPhong> getAll() {
        return loaiPhongRepository.findAll();
    }
}
