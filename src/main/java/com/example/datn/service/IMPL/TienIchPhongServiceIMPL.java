package com.example.datn.service.IMPL;

import com.example.datn.dto.request.VatTuLoaiPhongRequest;
import com.example.datn.dto.response.VatTuLoaiPhongPhongResponse;
import com.example.datn.model.VatTu;
import com.example.datn.model.VatTuLoaiPhong;
import com.example.datn.repository.TienIchPhongRepository;
import com.example.datn.service.TienIchPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TienIchPhongServiceIMPL implements TienIchPhongService {
    @Autowired
    TienIchPhongRepository tienIchPhongRepository;
    @Override
    public Page<VatTuLoaiPhongPhongResponse> getPage(Pageable pageable) {
        return tienIchPhongRepository.TienIchPhong(pageable);
    }




    @Override
    public VatTuLoaiPhong add(VatTuLoaiPhongRequest vatTuLoaiPhongRequest) {
        System.out.println(vatTuLoaiPhongRequest.getVatTu());
        System.out.println(vatTuLoaiPhongRequest.getLoaiPhong());
        VatTuLoaiPhong vatTuLoaiPhong = new VatTuLoaiPhong();
        vatTuLoaiPhong.setVatTu(vatTuLoaiPhongRequest.getVatTu());
        vatTuLoaiPhong.setLoaiPhong(vatTuLoaiPhongRequest.getLoaiPhong());
        return tienIchPhongRepository.save(vatTuLoaiPhong);
    }

    @Override
    public VatTu detail(Integer id) {
        return null;
    }

    @Override
    public void delete(Integer id) {
        tienIchPhongRepository.deleteById(id);
    }

    @Override
    public VatTuLoaiPhong update(VatTuLoaiPhongRequest vatTuLoaiPhongRequest) {
        Optional<VatTuLoaiPhong> tienIchPhong = tienIchPhongRepository.findById(vatTuLoaiPhongRequest.getId());
//        TienIchPhong tienIchPhong = new TienIchPhong();
        tienIchPhong.get().setId(vatTuLoaiPhongRequest.getId());
        tienIchPhong.get().setVatTu(vatTuLoaiPhongRequest.getVatTu());
        tienIchPhong.get().setLoaiPhong(vatTuLoaiPhongRequest.getLoaiPhong());
        return tienIchPhongRepository.save(tienIchPhong.get());
    }

    @Override
    public Page<VatTuLoaiPhongPhongResponse> findByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable) {
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
