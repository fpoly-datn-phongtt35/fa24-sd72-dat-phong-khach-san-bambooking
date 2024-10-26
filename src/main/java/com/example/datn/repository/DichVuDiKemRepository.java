package com.example.datn.repository;

import com.example.datn.model.DichVuDiKem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DichVuDiKemRepository extends JpaRepository<DichVuDiKem,Integer> {
//    @Query("SELECT dvdk FROM DichVuDiKem dvdk JOIN dvdk.loaiPhong lp WHERE lp.trangThai = :trangThai")
//    List<DichVuDiKem> findAllByLoaiPhongTrangThai(@Param("trangThai") String trangThai);
}
