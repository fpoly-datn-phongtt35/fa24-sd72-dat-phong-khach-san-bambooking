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

    @Query("SELECT FUNCTION('YEAR', tt.ngayThanhToan) AS doanhThuNam, " +
            "FUNCTION('MONTH',tt.ngayThanhToan) AS doanhThuThang, " +
            "(SELECT SUM(ttSub.tienThanhToan) FROM ThanhToan ttSub WHERE ttSub.hoaDon.id = hd.id GROUP BY ttSub.hoaDon.id) AS tongDoanhThu, " +
            "SUM(tthd.tienPhong) AS doanhThuPhong, " +
            "SUM(tthd.tienDichVu) AS doanhThuDichVu, " +
            "SUM(tthd.tienPhuThu) AS doanhThuPhuThu " +
            "FROM HoaDon hd " +
            "JOIN ThongTinHoaDon tthd ON hd.id = tthd.hoaDon.id " +
            "JOIN ThanhToan tt ON hd.id = tt.hoaDon.id " +
            "GROUP BY FUNCTION('YEAR',tt.ngayThanhToan), FUNCTION('MONTH', tt.ngayThanhToan), hd.id " +
            "ORDER BY FUNCTION('YEAR', tt.ngayThanhToan), FUNCTION('MONTH',tt.ngayThanhToan)")
    List<Object[]> thongKeDoanhThu();


    @Query("SELECT FUNCTION('YEAR',tt.ngayThanhToan) AS doanhThuNam, " +
            "FUNCTION('MONTH',tt.ngayThanhToan) AS doanhThuThang, " +
            "lp.tenLoaiPhong, COUNT(lp.tenLoaiPhong) " +
            "FROM ThongTinDatPhong ttdp " +
            "JOIN HoaDon hd ON hd.datPhong.id = ttdp.datPhong.id " +
            "JOIN LoaiPhong lp ON lp.id = ttdp.loaiPhong.id " +
            "JOIN ThanhToan tt ON tt.hoaDon.id = hd.id "+
            "WHERE ttdp.trangThai IN :trangThai " +
            "GROUP BY FUNCTION('YEAR',tt.ngayThanhToan), FUNCTION('MONTH',tt.ngayThanhToan), lp.tenLoaiPhong")
    List<Object[]> thongKeLoaiPhong(List<String> trangThai);

    @Query("SELECT FUNCTION('YEAR', tt.ngayThanhToan) AS doanhThuNam, " +
            "FUNCTION('MONTH', tt.ngayThanhToan) AS doanhThuThang, " +
            "dvsd.dichVu.tenDichVu, SUM(dvsd.soLuongSuDung) " +
            "FROM ThongTinDatPhong ttdp " +
            "JOIN HoaDon hd ON hd.datPhong.id = ttdp.datPhong.id " +
            "JOIN XepPhong xp ON ttdp.id = xp.thongTinDatPhong.id " +
            "JOIN DichVuSuDung dvsd ON xp.id = dvsd.xepPhong.id " +
            "JOIN ThanhToan tt ON tt.hoaDon.id = hd.id " +
            "WHERE dvsd.trangThai = true " +
            "AND ttdp.trangThai IN :trangThai " +
            "GROUP BY FUNCTION('YEAR', tt.ngayThanhToan), FUNCTION('MONTH', tt.ngayThanhToan), dvsd.dichVu.tenDichVu")
    List<Object[]> thongKeDichVu(List<String> trangThai);
}
