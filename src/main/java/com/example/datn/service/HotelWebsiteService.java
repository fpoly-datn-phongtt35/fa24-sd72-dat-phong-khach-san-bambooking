package com.example.datn.service;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.HoaDon;
import com.example.datn.model.KhachHang;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface HotelWebsiteService {
    KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request);
    DatPhongResponse addDatPhong(DatPhongRequest datPhongRequest);
    ThongTinDatPhong add(TTDPRequest request);

    Page<ThongTinDatPhong> getDPbyTenDangNhap(String tenDangNhap, Pageable pageable);
    HoaDon getHDByidDatPhong(Integer idDatPhong);
}
