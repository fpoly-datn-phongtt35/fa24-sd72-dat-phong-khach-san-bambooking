package com.example.datn.controller;

import com.example.datn.model.VaiTro;
import com.example.datn.service.VaiTroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
public class VaiTroController {
    @Autowired
   VaiTroService vaiTroService;
    @GetMapping("/vai-tro")
    public List<VaiTro> getAll(){
        return vaiTroService.getAll();
    }
}
