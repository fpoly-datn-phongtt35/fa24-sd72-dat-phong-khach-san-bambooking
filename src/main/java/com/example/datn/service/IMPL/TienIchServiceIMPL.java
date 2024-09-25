package com.example.datn.service.IMPL;

import com.example.datn.model.TienIch;
import com.example.datn.repository.TienIchRepository;
import com.example.datn.service.TienIchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TienIchServiceIMPL implements TienIchService {
    @Autowired
    TienIchRepository tienIchRepository;

    @Override
    public List<TienIch> getAll() {
        return tienIchRepository.findAll();
    }

    @Override
    public void add(TienIch tienIch) {
        tienIchRepository.save(tienIch);
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
    public void update(TienIch tienIch) {
        tienIchRepository.save(tienIch);
    }
}
