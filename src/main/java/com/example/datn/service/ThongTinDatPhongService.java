package com.example.datn.service;

import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.TTDPResponse;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ThongTinDatPhongService {
    ThongTinDatPhong add(TTDPRequest request);
    Page<ThongTinDatPhong> getAll(Pageable pageable);
    List<ThongTinDatPhong> getByIDDP(Integer iddp);
    ThongTinDatPhong update(TTDPRequest request);

    Page<TTDPResponse> HienThiQuanLy(String trangThai, Pageable pageable);
    List<ThongTinDatPhong> findByMaDatPhong(String maDatPhong);

}
