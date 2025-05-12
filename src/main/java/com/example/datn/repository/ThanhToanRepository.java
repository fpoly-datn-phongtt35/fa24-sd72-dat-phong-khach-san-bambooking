package com.example.datn.repository;

import com.example.datn.model.ThanhToan;
import com.example.datn.model.ThongTinDatPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThanhToanRepository extends JpaRepository<ThanhToan, Integer> {

    @Query("SELECT FUNCTION('YEAR', hd.ngayTao) AS doanhThuNam, " +
            "FUNCTION('MONTH', hd.ngayTao) AS doanhThuThang, " +
            "SUM(DISTINCT hd.tongTien) AS tongDoanhThu, " +
            "SUM(tthd.tienPhong) AS doanhThuPhong, " +
            "SUM(tthd.tienDichVu) AS doanhThuDichVu, " +
            "SUM(tthd.tienPhuThu) AS doanhThuPhuThu " +
            "FROM HoaDon hd " +
            "LEFT JOIN ThongTinHoaDon tthd ON hd.id = tthd.hoaDon.id " +
            "GROUP BY FUNCTION('YEAR', hd.ngayTao), FUNCTION('MONTH', hd.ngayTao), hd.id " +
            "ORDER BY FUNCTION('YEAR', hd.ngayTao), FUNCTION('MONTH', hd.ngayTao)")
    List<Object[]> thongKeDoanhThu();


    @Query("SELECT FUNCTION('YEAR', hd.ngayTao) AS doanhThuNam, " +
            "FUNCTION('MONTH', hd.ngayTao) AS doanhThuThang, " +
            "lp.tenLoaiPhong, COUNT(lp.tenLoaiPhong) " +
            "FROM ThongTinDatPhong ttdp " +
            "JOIN HoaDon hd ON hd.datPhong.id = ttdp.datPhong.id " +
            "JOIN LoaiPhong lp ON lp.id = ttdp.loaiPhong.id " +
            "WHERE ttdp.trangThai IN :trangThai " +
            "GROUP BY FUNCTION('YEAR', hd.ngayTao), FUNCTION('MONTH', hd.ngayTao), lp.tenLoaiPhong")
    List<Object[]> thongKeLoaiPhong(List<String> trangThai);

    @Query("SELECT FUNCTION('YEAR',  hd.ngayTao) AS doanhThuNam, " +
            "FUNCTION('MONTH',  hd.ngayTao) AS doanhThuThang, " +
            "dvsd.dichVu.tenDichVu, SUM(dvsd.soLuongSuDung) " +
            "FROM ThongTinDatPhong ttdp " +
            "JOIN HoaDon hd ON hd.datPhong.id = ttdp.datPhong.id " +
            "JOIN XepPhong xp ON ttdp.id = xp.thongTinDatPhong.id " +
            "JOIN DichVuSuDung dvsd ON xp.id = dvsd.xepPhong.id " +
            "WHERE dvsd.trangThai = true AND dvsd.giaSuDung != 0 " +
            "AND ttdp.trangThai IN :trangThai " +
            "GROUP BY FUNCTION('YEAR',  hd.ngayTao), FUNCTION('MONTH',  hd.ngayTao), dvsd.dichVu.tenDichVu")
    List<Object[]> thongKeDichVu(List<String> trangThai);
}
