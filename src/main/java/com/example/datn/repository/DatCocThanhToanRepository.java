package com.example.datn.repository;

import com.example.datn.model.DatCocThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DatCocThanhToanRepository extends JpaRepository<DatCocThanhToan, Integer> {
    Optional<DatCocThanhToan> findByOrderCodePayment(Long orderCodePayment);
    Optional<DatCocThanhToan> findByDatPhongIdAndTrangThai(Integer idDatPhong, String trangThai);
    long countByDatPhongId(Integer idDatPhong);

    @Query("""
            SELECT sum(d.tienThanhToan)
            FROM DatCocThanhToan d
            WHERE d.datPhong.id = :datPhongId AND d.trangThai = 'PAID'
            """)
    Double findTotalByDatPhongId(@Param("datPhongId") Integer idDatPhong);

    @Query("""
            SELECT dc
            FROM DatCocThanhToan dc
            WHERE dc.datPhong.id = :iddp AND dc.trangThai = 'PAID'
            """)
    DatCocThanhToan findDatCocByIddp(@Param("iddp") Integer iddp);

    @Query("""
            SELECT dc
            FROM DatCocThanhToan dc
            JOIN HoaDon hd ON dc.datPhong.id = hd.datPhong.id
            WHERE hd.id = :idHoaDon AND dc.trangThai = 'PAID'
            """)
    DatCocThanhToan findDatCocByIdHoaDon(@Param("idHoaDon") Integer idHoaDon);
}
