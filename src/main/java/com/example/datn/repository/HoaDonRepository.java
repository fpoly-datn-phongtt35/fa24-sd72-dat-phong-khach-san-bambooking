package com.example.datn.repository;

import com.example.datn.dto.response.DichVuSuDungResponse;
import com.example.datn.dto.response.PhuThuResponse;
import com.example.datn.model.HoaDon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {

    Page<HoaDon> findAllByOrderByNgayTaoDesc(Pageable pageable);

    @Query("""
                SELECT hd FROM HoaDon hd
                JOIN hd.datPhong dp
                JOIN dp.khachHang kh
                WHERE (:trangThai IS NULL OR hd.trangThai = :trangThai)
                AND (:keyword IS NULL OR (
                    hd.maHoaDon LIKE %:keyword%
                    OR CONCAT(hd.nhanVien.ho, ' ', hd.nhanVien.ten) LIKE %:keyword%
                    OR dp.maDatPhong LIKE %:keyword%
                    OR CONCAT(kh.ho, ' ', kh.ten) LIKE %:keyword%
                    OR kh.sdt LIKE %:keyword%
                ))
                ORDER BY hd.ngayTao DESC
            """)
    Page<HoaDon> findByTrangThai(
            @Param("trangThai") String trangThai,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("""
            SELECT new com.example.datn.dto.response.DichVuSuDungResponse(p.tenPhong, dv.tenDichVu, dvsd.giaSuDung, dvsd.soLuongSuDung)
            FROM ThongTinHoaDon tthd
            JOIN TraPhong tp ON tp.id = tthd.traPhong.id
            JOIN XepPhong xp ON xp.id = tp.xepPhong.id
            JOIN Phong p ON p.id = xp.phong.id
            JOIN DichVuSuDung dvsd ON dvsd.xepPhong.id = xp.id
            JOIN DichVu dv ON dv.id = dvsd.dichVu.id
            WHERE tthd.hoaDon.id = :hoaDonId
            """)
    List<DichVuSuDungResponse> findDichVuSuDungByIdHoaDon(@Param("hoaDonId") Integer hoaDonId);

    boolean existsByMaHoaDon(String maHoaDon);

    @Query("""
            SELECT new com.example.datn.dto.response.PhuThuResponse(p.tenPhong, pt.tenPhuThu, pt.soLuong,pt.tienPhuThu)
            FROM ThongTinHoaDon tthd
            JOIN TraPhong tp ON tp.id = tthd.traPhong.id
            JOIN XepPhong xp ON xp.id = tp.xepPhong.id
            JOIN Phong p ON p.id = xp.phong.id
            JOIN PhuThu pt ON pt.xepPhong.id = xp.id
            WHERE tthd.hoaDon.id = :hoaDonId
            """)
    List<PhuThuResponse> findPhuThuByIdHoaDon(@Param("hoaDonId") Integer idHoaDon);

    @Query("""
            SELECT hd FROM HoaDon hd WHERE hd.datPhong.id = :idDatPhong
            """)
    List<HoaDon> getHDByidDatPhong(@Param("idDatPhong") Integer idDatPhong);
}
