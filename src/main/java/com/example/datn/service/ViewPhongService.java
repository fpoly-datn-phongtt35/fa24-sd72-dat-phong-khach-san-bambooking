package com.example.datn.service;

import com.example.datn.dto.response.PhongResponse;
import com.example.datn.model.DichVuSuDung;
import com.example.datn.model.XepPhong;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ViewPhongService {
    List<PhongResponse> findRoomsByCriteria(String tinhTrang, String keyword,List<Integer> idLoaiPhong,Integer giaMin,Integer giaMax,Integer soTang);

    public XepPhong RoomDetail(int idPhong, LocalDateTime date);

    public List<DichVuSuDung> addDVDKtoDVSD (int idXepPhong);
}
