package com.example.datn.service;

import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.TraPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TraPhongService {
    Page<TraPhongResponse> getAllTraPhong(Pageable pageable);
    TraPhong checkOutById(Integer idTraPhong);
    List<TraPhongResponse> checkOutByKey(String key);
    List<TraPhong> DSTraPhong();
    void sendMailCheckout(ThongTinDatPhong thongTinDatPhong);
//    List<TraPhongResponse> findXepPhongByKey(String key);
}