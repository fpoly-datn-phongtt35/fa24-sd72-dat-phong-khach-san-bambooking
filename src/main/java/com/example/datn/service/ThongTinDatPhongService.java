package com.example.datn.service;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.model.DatPhong;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ThongTinDatPhongService {
    ThongTinDatPhong add(TTDPRequest request);

}
