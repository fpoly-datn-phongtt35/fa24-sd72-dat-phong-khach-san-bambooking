package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DanhGiaRequest;
import com.example.datn.model.DanhGia;
import com.example.datn.model.KhachHang;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.repository.DanhGiaRepository;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.service.DanhGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DanhGiaServiceIMPL implements DanhGiaService {
    @Autowired
    DanhGiaRepository danhGiaRepository;
    @Autowired
    KhachHangRepository khachHangRepository;
    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;
    @Override
    public List<DanhGia> getAllDanhGia(){
        return danhGiaRepository.getAllDanhGia("Hoạt động");
    }
    @Override
    public DanhGia addDanhGia(DanhGiaRequest danhGiaRequest){
        KhachHang khachHang = khachHangRepository.getKHbyID(danhGiaRequest.getIdKhachHang());
        ThongTinDatPhong thongTinDatPhong = thongTinDatPhongRepository.getTTDPById(danhGiaRequest.getIdThongTinDatPhong());
        DanhGia danhGia = new DanhGia();
        danhGia.setKhachHang(khachHang);
        danhGia.setThongTinDatPhong(thongTinDatPhong);
        danhGia.setStars(danhGiaRequest.getStars());
        danhGia.setNhanXet(danhGiaRequest.getNhanXet());
        danhGia.setNgayTao(LocalDateTime.now());
        danhGia.setNgaySua(LocalDateTime.now());
        danhGia.setTrangThai("Hoạt động");
        return danhGiaRepository.save(danhGia);
    }

    @Override
    public KhachHang getKh(Integer idKhachHang){
        return khachHangRepository.getKHbyID(idKhachHang);

    }


}
