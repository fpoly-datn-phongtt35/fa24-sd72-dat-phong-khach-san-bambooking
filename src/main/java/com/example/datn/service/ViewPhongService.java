package com.example.datn.service;

import com.example.datn.dto.response.PhongResponse;
import com.example.datn.model.XepPhong;

import java.util.List;

public interface ViewPhongService {
    List<PhongResponse> findRoomsByCriteria(String tinhTrang, String keyword);

    public XepPhong RoomDetail(int idPhong);
}
