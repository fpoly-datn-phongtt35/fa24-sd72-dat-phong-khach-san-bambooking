package com.example.datn.service;

import com.example.datn.dto.response.PhongResponse;

import java.util.List;

public interface ViewPhongService {
    List<PhongResponse> findRoomsByCriteria(String tinhTrang, String keyword);
}
