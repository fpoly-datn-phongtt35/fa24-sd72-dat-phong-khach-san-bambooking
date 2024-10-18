package com.example.datn.service.IMPL;
import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.TienIch;
import com.example.datn.repository.LoaiPhongRepository;
import com.example.datn.service.LoaiPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoaiPhongServiceIMPL implements LoaiPhongService {

    @Autowired
    LoaiPhongRepository loaiPhongRepository;

    @Override
    public List<LoaiPhong> getAllLoaiPhong() {
        return loaiPhongRepository.findAll();
    }

    public List<LoaiPhong> getAll() {
        return loaiPhongRepository.findAll();
    }


    @Override
    public Page<LoaiPhongResponse> getPage(Pageable pageable) {

        return loaiPhongRepository.LoaiPhong(pageable);
    }




    @Override
    public LoaiPhong add(LoaiPhongRequest loaiPhongRequest) {
        LoaiPhong loaiPhong = new LoaiPhong();
        loaiPhong.setTenLoaiPhong(loaiPhongRequest.getTenLoaiPhong());
        loaiPhong.setDienTich(loaiPhongRequest.getDienTich());
        loaiPhong.setSucChuaLon(loaiPhongRequest.getSucChuaLon());
        loaiPhong.setSucChuaNho(loaiPhongRequest.getSucChuaNho());
        loaiPhong.setMoTa(loaiPhongRequest.getMoTa());
        loaiPhong.setTrangThai(loaiPhongRequest.getTrangThai());
        return loaiPhongRepository.save(loaiPhong);
    }

    @Override
    public LoaiPhong detail(Integer id) {

        return loaiPhongRepository.findById(id).get();
    }

    @Override
    public void delete(Integer id) {
        loaiPhongRepository.deleteById(id);
    }

    @Override
    public LoaiPhong update(LoaiPhongRequest loaiPhongRequest) {
        Optional<LoaiPhong> loaiPhong = loaiPhongRepository.findById(loaiPhongRequest.getId());
        loaiPhong.get().setId(loaiPhongRequest.getId());
        loaiPhong.get().setTenLoaiPhong(loaiPhongRequest.getTenLoaiPhong());
        loaiPhong.get().setDienTich(loaiPhongRequest.getDienTich());
        loaiPhong.get().setSucChuaLon(loaiPhongRequest.getSucChuaLon());
        loaiPhong.get().setSucChuaNho(loaiPhongRequest.getSucChuaNho());
        loaiPhong.get().setMoTa(loaiPhongRequest.getMoTa());
        loaiPhong.get().setTrangThai(loaiPhongRequest.getTrangThai());
        return loaiPhongRepository.save(loaiPhong.get());
    }

    @Override
    public  Page<LoaiPhong> search(String tenTienIch,Pageable pageable) {
        return loaiPhongRepository.search(tenTienIch,pageable);
    }




}
