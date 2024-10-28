package com.example.datn.repository;

import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.dto.response.TienIchResponse;
import com.example.datn.model.TienIch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TienIchRepository extends JpaRepository<TienIch,Integer> {
    @Query("select new com.example.datn.dto.response.TienIchResponse(ti.id," +
            "ti.tenTienIch," +
            "ti.hinhAnh)" +
            "from TienIch ti")
    Page<TienIchResponse> TienIch(Pageable pageable);

    @Query("SELECT tn FROM TienIch tn " +
            "WHERE tn.tenTienIch LIKE %:tenTienIch% "
    )
    Page<TienIch> search(@Param("tenTienIch") String keyword,Pageable pageable);



}
