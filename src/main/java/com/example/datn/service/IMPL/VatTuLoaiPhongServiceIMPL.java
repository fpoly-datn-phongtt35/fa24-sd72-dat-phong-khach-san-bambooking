package com.example.datn.service.IMPL;

import com.example.datn.dto.request.VatTuLoaiPhongRequest;
import com.example.datn.dto.response.VatTuLoaiPhongResponse;
import com.example.datn.model.VatTu;
import com.example.datn.model.VatTuLoaiPhong;
import com.example.datn.repository.VatTuLoaiPhongRepository;
import com.example.datn.service.VatTuLoaiPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VatTuLoaiPhongServiceIMPL implements VatTuLoaiPhongService {
    @Autowired
    VatTuLoaiPhongRepository vatTuLoaiPhongRepository;
    @Override
    public Page<VatTuLoaiPhongResponse> getPage(Pageable pageable) {
        return vatTuLoaiPhongRepository.VatTuLoaiPhong(pageable);
    }




    @Override
    public VatTuLoaiPhong add(VatTuLoaiPhongRequest vatTuLoaiPhongRequest) {
        VatTuLoaiPhong vatTuLoaiPhong = new VatTuLoaiPhong();
        vatTuLoaiPhong.setVatTu(vatTuLoaiPhongRequest.getVatTu());
        vatTuLoaiPhong.setLoaiPhong(vatTuLoaiPhongRequest.getLoaiPhong());
        vatTuLoaiPhong.setSoLuong(vatTuLoaiPhongRequest.getSoLuong());
        return vatTuLoaiPhongRepository.save(vatTuLoaiPhong);
    }

    @Override
    public VatTu detail(Integer id) {
        return null;
    }

    @Override
    public void delete(Integer id) {
        vatTuLoaiPhongRepository.deleteById(id);
    }

    @Override
    public VatTuLoaiPhong update(VatTuLoaiPhongRequest vatTuLoaiPhongRequest) {
        Optional<VatTuLoaiPhong> vatTuLoaiPhong = vatTuLoaiPhongRepository.findById(vatTuLoaiPhongRequest.getId());
//        TienIchPhong tienIchPhong = new TienIchPhong();
        vatTuLoaiPhong.get().setId(vatTuLoaiPhongRequest.getId());
        vatTuLoaiPhong.get().setVatTu(vatTuLoaiPhongRequest.getVatTu());
        vatTuLoaiPhong.get().setLoaiPhong(vatTuLoaiPhongRequest.getLoaiPhong());
        vatTuLoaiPhong.get().setSoLuong(vatTuLoaiPhongRequest.getSoLuong());
        return vatTuLoaiPhongRepository.save(vatTuLoaiPhong.get());
    }

    @Override
    public List<VatTuLoaiPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong) {
        return vatTuLoaiPhongRepository.findByIDLoaiPhong(idLoaiPhong);
    }

    @Override
    public Page<Object> ListVatTuFindByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable) {
        return vatTuLoaiPhongRepository.ListVatTuFindByIDLoaiPhong(idLoaiPhong,pageable);
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
