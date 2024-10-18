package com.example.datn.service.IMPL;
import com.example.datn.model.TienIch;
import com.example.datn.repository.TienIchRepository;
import com.example.datn.service.TienIchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.TienIch;
import com.example.datn.model.TienIchPhong;
import com.example.datn.repository.TienIchPhongRepository;
import com.example.datn.repository.TienIchRepository;
import com.example.datn.service.TienIchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class TienIchServiceIMPL implements TienIchService {
    @Autowired
    TienIchRepository tienIchRepository;
    @Override
    public List<TienIch> getAll() {
        return tienIchRepository.findAll();
    }

    @Override
    public Page<TienIchResponse> getPage(Pageable pageable) {

        return tienIchRepository.TienIch(pageable);
    }




    @Override
    public TienIch add(TienIchRequest tienIchRequest) {
        TienIch tienIch = new TienIch();
        tienIch.setTenTienIch(tienIchRequest.getTenTienIch());
        tienIch.setHinhAnh(tienIchRequest.getHinhAnh());
        return tienIchRepository.save(tienIch);
    }

    @Override
    public TienIch detail(Integer id) {
        return tienIchRepository.findById(id).get();
    }

    @Override
    public void delete(Integer id) {
        tienIchRepository.deleteById(id);
    }

    @Override
    public TienIch update(TienIchRequest tienIchRequest) {
        Optional<TienIch> tienIch = tienIchRepository.findById(tienIchRequest.getId());
        tienIch.get().setId(tienIchRequest.getId());
        tienIch.get().setTenTienIch(tienIchRequest.getTenTienIch());
        tienIch.get().setHinhAnh(tienIchRequest.getHinhAnh());
        return tienIchRepository.save(tienIch.get());
    }

    @Override
    public  Page<TienIch> search(String tenTienIch,Pageable pageable) {
        return tienIchRepository.search(tenTienIch,pageable);
    }

}
