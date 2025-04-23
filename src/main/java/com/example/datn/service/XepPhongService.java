package com.example.datn.service;

import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.model.XepPhong;

import java.util.List;
import java.util.Optional;

public interface XepPhongService {
    List<XepPhong> getAll();
    XepPhong addXepPhong(XepPhongRequest xepPhongRequest);
    XepPhong updateXepPhong(XepPhongRequest xepPhongRequest);
    XepPhong getByMaTTDP(String maTTDP);
    XepPhong checkIn(XepPhongRequest xepPhongRequest);

    List<XepPhong> findByKey(String key);
    Optional<XepPhong> getXepPhongByThongTinDatPhongId(Integer idThongTinDatPhong);

}
