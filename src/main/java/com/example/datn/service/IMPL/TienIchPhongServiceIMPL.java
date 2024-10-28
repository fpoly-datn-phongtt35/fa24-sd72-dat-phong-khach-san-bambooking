package com.example.datn.service.IMPL;

import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.model.TienIch;
import com.example.datn.model.TienIchPhong;
import com.example.datn.repository.TienIchPhongRepository;
import com.example.datn.service.TienIchPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TienIchPhongServiceIMPL implements TienIchPhongService {
    @Autowired
    TienIchPhongRepository tienIchPhongRepository;
    @Override
    public Page<TienIchPhongResponse> getPage( Pageable pageable) {
        return tienIchPhongRepository.TienIchPhong(pageable);
    }




    @Override
    public TienIchPhong add(TienIchPhongRequest tienIchPhongRequest) {
        System.out.println(tienIchPhongRequest.getTienIch());
        System.out.println(tienIchPhongRequest.getLoaiPhong());
        TienIchPhong tienIchPhong = new TienIchPhong();
        tienIchPhong.setTienIch(tienIchPhongRequest.getTienIch());
        tienIchPhong.setLoaiPhong(tienIchPhongRequest.getLoaiPhong());
        return tienIchPhongRepository.save(tienIchPhong);
    }

    @Override
    public TienIch detail(Integer id) {
        return null;
    }

    @Override
    public void delete(Integer id) {
        tienIchPhongRepository.deleteById(id);
    }

    @Override
    public TienIchPhong update(TienIchPhongRequest tienIchPhongRequest) {
        Optional<TienIchPhong> tienIchPhong = tienIchPhongRepository.findById(tienIchPhongRequest.getId());
//        TienIchPhong tienIchPhong = new TienIchPhong();
        tienIchPhong.get().setId(tienIchPhongRequest.getId());
        tienIchPhong.get().setTienIch(tienIchPhongRequest.getTienIch());
        tienIchPhong.get().setLoaiPhong(tienIchPhongRequest.getLoaiPhong());
        return tienIchPhongRepository.save(tienIchPhong.get());
    }

    @Override
    public Page<TienIchPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable) {
        return tienIchPhongRepository.findByIDLoaiPhong(idLoaiPhong,pageable);
    }

    @Override
    public Page<Object> ListTienIchFindByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable) {
        return tienIchPhongRepository.ListTienIchFindByIDLoaiPhong(idLoaiPhong,pageable);
    }

//    @Override
//    public List<TienIch> getAll() {
//        return tienIchRepository.findAll();
//    }
//
//    @Override
//    public void add(TienIch tienIch) {
//        tienIchRepository.save(tienIch);
//    }
//
//    @Override
//    public TienIch detail(Integer id) {
//        return tienIchRepository.findById(id).get();
//    }
//
//    @Override
//    public void delete(Integer id) {
//        tienIchRepository.deleteById(id);
//    }
//
//    @Override
//    public void update(TienIch tienIch) {
//        tienIchRepository.save(tienIch);
//    }
}
