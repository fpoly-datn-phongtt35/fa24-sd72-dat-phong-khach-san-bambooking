package com.example.datn.repository;

import com.example.datn.model.XepPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface XepPhongRepository extends JpaRepository<XepPhong,Integer> {

}
