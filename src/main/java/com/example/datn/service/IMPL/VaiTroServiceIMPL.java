package com.example.datn.service.IMPL;

import com.example.datn.model.VaiTro;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.service.VaiTroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class VaiTroServiceIMPL implements VaiTroService {
    @Autowired
    VaiTroRepository vaiTroRepository;
    @Override
    public List<VaiTro> getAll() {
        return vaiTroRepository.findAll();
    }
}
