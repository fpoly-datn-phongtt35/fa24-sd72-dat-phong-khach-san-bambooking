package com.example.datn.service.IMPL;

import com.example.datn.model.XepPhong;
import com.example.datn.repository.DichVuRepository;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.service.XepPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class XepPhongServiceIMPL implements XepPhongService {
    @Autowired
    XepPhongRepository xepPhongRepository;

    @Override
    public List<XepPhong> getAll() {
        return xepPhongRepository.findAll();
    }
}
