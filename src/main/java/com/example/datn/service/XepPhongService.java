package com.example.datn.service;

import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.model.XepPhong;

import java.util.List;

public interface XepPhongService {
    List<XepPhong> getAll();
    XepPhong addXepPhong(XepPhongRequest xepPhongRequest);
    XepPhong updateXepPhong(XepPhongRequest xepPhongRequest);
    XepPhong getByMaTTDP(String maTTDP);
    XepPhong checkIn(String maTTDP);

}
