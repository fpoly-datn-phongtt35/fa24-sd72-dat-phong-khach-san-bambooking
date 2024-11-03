package com.example.datn.service;

import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.model.XepPhong;

public interface XepPhongService {
    XepPhong addXepPhong(XepPhongRequest xepPhongRequest);
    XepPhong updateXepPhong(XepPhongRequest xepPhongRequest);
    XepPhong getByMaTTDP(String maTTDP);
}
