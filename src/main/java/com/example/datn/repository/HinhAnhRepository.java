package com.example.datn.repository;

import com.example.datn.model.HinhAnh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhRepository extends JpaRepository<HinhAnh, Integer> {
    @Query("""
            select ha
            from HinhAnh ha
            where ha.phong.tenPhong like %:keyword%
            or ha.tenAnh like %:keyword%
            """)
    Page<HinhAnh> search(@Param("keyword") String keyword, Pageable pageable);
    @Query("""
            select ha
            from HinhAnh ha
            where ha.phong.id = :keyword
            """)
    List<HinhAnh> searchByIDPhong(@Param("keyword") String keyword);
}
