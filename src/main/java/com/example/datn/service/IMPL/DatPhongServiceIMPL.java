package com.example.datn.service.IMPL;

import com.example.datn.repository.DatPhongRepository;
import com.example.datn.service.DatPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DatPhongServiceIMPL implements DatPhongService {
    @Autowired
    DatPhongRepository datPhongRepository;

}
