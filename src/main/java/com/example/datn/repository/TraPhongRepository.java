package com.example.datn.repository;

import com.example.datn.model.TraPhong;
import com.example.datn.model.XepPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TraPhongRepository extends JpaRepository<TraPhong, Integer> {
//

    @Query("SELECT tp FROM TraPhong tp JOIN FETCH tp.xepPhong WHERE tp.xepPhong = :xepPhong")
    Optional<TraPhong> findByXepPhong(@Param("xepPhong") XepPhong xepPhong);
}
