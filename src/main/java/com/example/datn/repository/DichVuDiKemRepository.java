package com.example.datn.repository;

import com.example.datn.dto.response.DichVuDiKemResponse;
import com.example.datn.model.DichVuDiKem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DichVuDiKemRepository extends JpaRepository<DichVuDiKem,Integer> {
    @Query("select new com.example.datn.dto.response.DichVuDiKemResponse(dvdk.id," +
            "dvdk.dichVu.tenDichVu," +
            "dvdk.loaiPhong.tenLoaiPhong, " + // Thêm trangThai vào query
            "dvdk.trangThai) " + // Giả sử rằng bạn có thuộc tính trangThai trong model
            "from DichVuDiKem dvdk WHERE dvdk.loaiPhong.id = :idLoaiPhong")
    Page<DichVuDiKemResponse> findByIDLoaiPhong(Integer idLoaiPhong, Pageable pageable);
}
