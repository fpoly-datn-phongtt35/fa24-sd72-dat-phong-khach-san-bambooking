package com.example.datn.repository;

import com.example.datn.model.Phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhongRepository extends JpaRepository<Phong,Integer> {
    @Query(value = "select * from phong where id_loai_phong = 4", nativeQuery = true)
    List<Phong> findByLoaiPhong();

    List<Phong> findPhongsByLoaiPhong_Id(Integer id);

}
