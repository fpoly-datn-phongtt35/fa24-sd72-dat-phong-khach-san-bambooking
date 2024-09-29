package com.example.datn.service.IMPL;

import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.service.DatPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DatPhongServiceIMPL implements DatPhongService {
    @Autowired
    DatPhongRepository datPhongRepository;

    @Override
    public Page<DatPhongResponse> getByTrangThai(String tt, Pageable pageable) {
        return datPhongRepository.DatPhongTheoTrangThai(tt,pageable);
    }

    @Override
    public List<DatPhong> getAll() {
        return datPhongRepository.findAll();
    }

    @Override
    public Boolean add(DatPhong datPhong) {
        if(datPhong!=null){
            datPhongRepository.save(datPhong);
            return true;
        }
        return false;
    }

    @Override
    public Boolean update(DatPhong datPhong) {
        if(datPhong!=null){
            datPhongRepository.save(datPhong);
            return true;
        }
        return false;
    }

    @Override
    public Boolean delete(Integer id) {
        if(id!=null){
            datPhongRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
