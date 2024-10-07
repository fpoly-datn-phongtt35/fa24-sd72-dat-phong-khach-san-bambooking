package com.example.datn.controller;

import com.example.datn.dto.request.TienIchPhongRequest;
import com.example.datn.dto.request.TienIchRequest;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.TienIch;
import com.example.datn.repository.TienIchRepository;
import com.example.datn.service.IMPL.TienIchPhongServiceIMPL;
import com.example.datn.service.IMPL.TienIchServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/tien-ich")
public class TienIchController {

    @Autowired
    TienIchRepository tienIchRepository;
    @Autowired
    TienIchServiceIMPL tienIchServiceIMPL;
    @GetMapping("/home")
    public ResponseEntity<?> ListTienIch(){
        List<TienIch> ti = tienIchRepository.findAll();
        return ResponseEntity.ok(ti);
    }
    @GetMapping("/index")
    public ResponseEntity<?> DanhSachTienIch(Pageable pageable){
        Page<TienIchResponse> ti = tienIchServiceIMPL.getPage(pageable);
        return ResponseEntity.ok(ti);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody TienIchRequest tienIchRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(tienIchServiceIMPL.add(tienIchRequest));
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable int id){
        tienIchServiceIMPL.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody TienIchRequest tienIch){
        tienIchServiceIMPL.update(tienIch);
        return ResponseEntity.status(HttpStatus.CREATED).body(tienIchServiceIMPL.update(tienIch));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam("tenTienIch") String tenTienIch, Pageable pageable) {
        Page<TienIch> ti = tienIchServiceIMPL.search(tenTienIch, pageable);
        return ResponseEntity.ok(ti);
    }

}
