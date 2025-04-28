package com.example.datn.service;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.HoaDon;
import com.example.datn.model.KhachHang;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface HotelWebsiteService {
    KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request);
    DatPhongResponse addDatPhong(DatPhongRequest datPhongRequest);
    ThongTinDatPhong add(TTDPRequest request);

    List<DatPhong> getDPbyTenDangNhap(String tenDangNhap, String keyword, LocalDate ngayNhanPhong, LocalDate ngayTraPhong );
    List<HoaDon> getHDByidDatPhong(Integer idDatPhong);

    void tracuuLichSuDP(String keyword);

    List<DatPhong> getLichSuDPbyEmail (String email);

    void guiEmailXacNhandp(DatPhongRequest datPhongRequest);

    boolean xacNhanDP(Integer iddp);

     void emailDatPhongThanhCong(Integer iddp);

    void guiEmailXacNhandpsauUDKhachHang(Integer iddp);


    KhachHang updateKhachHang(KhachHangDatPhongRequest request);
}
