package com.example.datn.service;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.model.DatPhong;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ThongTinDatPhongService {
    ThongTinDatPhong add(TTDPRequest request);
    Page<ThongTinDatPhong> getAll(Pageable pageable);
    Page<ThongTinDatPhong> getByIDDP(Integer iddp, Pageable pageable);



}
