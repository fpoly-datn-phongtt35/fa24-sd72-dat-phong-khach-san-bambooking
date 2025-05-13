package com.example.datn.repository;

import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.LoaiPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface LoaiPhongRepository extends JpaRepository<LoaiPhong, Integer>{
    @Query("select new com.example.datn.dto.response.LoaiPhongResponse(lp.id," +
            "lp.tenLoaiPhong," +
            "lp.maLoaiPhong," +
            "lp.dienTich," +
            "lp.soKhachTieuChuan," +
            "lp.soKhachToiDa," +
            "lp.treEmTieuChuan," +
            "lp.treEmToiDa," +
            "lp.donGia," +
            "lp.phuThuNguoiLon," +
            "lp.phuThuTreEm," +
            "lp.moTa," +
            "lp.trangThai)" +
            "from LoaiPhong lp")
    Page<LoaiPhongResponse> LoaiPhong(Pageable pageable);

    @Query("SELECT lp FROM LoaiPhong lp " +
            "WHERE (:tenLoaiPhong IS NULL OR lp.tenLoaiPhong LIKE %:tenLoaiPhong%) " +
            "AND (:dienTichMin IS NULL OR lp.dienTich >= :dienTichMin) " +
            "AND (:dienTichMax IS NULL OR lp.dienTich <= :dienTichMax) " +
            "AND (:soKhachTieuChuan IS NULL OR lp.soKhachTieuChuan >= :soKhachTieuChuan) " +
            "AND (:soKhachToiDa IS NULL OR lp.soKhachToiDa >= :soKhachToiDa) " +
            "AND (:treEmTieuChuan IS NULL OR lp.treEmTieuChuan >= :treEmTieuChuan) " +
            "AND (:treEmToiDa IS NULL OR lp.treEmToiDa >= :treEmToiDa) " +
            "AND (:donGiaMin IS NULL OR lp.donGia >= :donGiaMin) " +
            "AND (:donGiaMax IS NULL OR lp.donGia <= :donGiaMax) " +
            "AND (:phuThuNguoiLonMin IS NULL OR lp.phuThuNguoiLon >= :phuThuNguoiLonMin) " +
            "AND (:phuThuNguoiLonMax IS NULL OR lp.phuThuNguoiLon <= :phuThuNguoiLonMax) " +
            "AND (:phuThuTreEmMin IS NULL OR lp.phuThuTreEm >= :phuThuTreEmMin) " +
            "AND (:phuThuTreEmMax IS NULL OR lp.phuThuTreEm <= :phuThuTreEmMax) " +
            "AND (:trangThai IS NULL OR lp.trangThai = :trangThai)")
    Page<LoaiPhong> filter(
            @Param("tenLoaiPhong") String tenLoaiPhong,
            @Param("dienTichMin") Integer dienTichMin,
            @Param("dienTichMax") Integer dienTichMax,
            @Param("soKhachTieuChuan") Integer soKhachTieuChuan,
            @Param("soKhachToiDa") Integer soKhachToiDa,
            @Param("treEmTieuChuan") Integer treEmTieuChuan,
            @Param("treEmToiDa") Integer treEmToiDa,
            @Param("donGiaMin") Double donGiaMin,
            @Param("donGiaMax") Double donGiaMax,
            @Param("phuThuNguoiLonMin") Double phuThuNguoiLonMin,
            @Param("phuThuNguoiLonMax") Double phuThuNguoiLonMax,
            @Param("phuThuTreEmMin") Double phuThuTreEmMin,
            @Param("phuThuTreEmMax") Double phuThuTreEmMax,
            @Param("trangThai") Boolean trangThai,
            Pageable pageable);

    @Query(value = """
    SELECT new com.example.datn.dto.response.LoaiPhongResponse(
        lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, 
        lp.soKhachTieuChuan, lp.soKhachToiDa, lp.treEmTieuChuan, 
        lp.treEmToiDa, lp.donGia, lp.phuThuNguoiLon, lp.phuThuTreEm, 
        lp.moTa, lp.trangThai)
    FROM LoaiPhong lp
    JOIN Phong p ON p.loaiPhong.id = lp.id
    WHERE p.trangThai = true
    GROUP BY lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, 
             lp.soKhachTieuChuan, lp.soKhachToiDa, lp.treEmTieuChuan, 
             lp.treEmToiDa, lp.donGia, lp.phuThuNguoiLon, lp.phuThuTreEm, 
             lp.moTa, lp.trangThai
    HAVING (COUNT(p.id) - 
            (SELECT COUNT(xp) 
             FROM XepPhong xp 
             WHERE xp.phong.loaiPhong.id = lp.id 
             AND xp.ngayNhanPhong < :ngayTraPhong 
             AND xp.ngayTraPhong > :ngayNhanPhong 
             AND xp.trangThai IN :trangThaiXP) - 
            (SELECT COUNT(tp) 
             FROM ThongTinDatPhong tp 
             WHERE tp.loaiPhong.id = lp.id 
             AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS date) 
             AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS date) 
             AND tp.trangThai IN :trangThaiTTDP)
           ) > 0
    """)
    List<LoaiPhongResponse> findLoaiPhongResponseTest(
            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
            @Param("trangThaiTTDP") List<String> trangThaiTTDP,
            @Param("trangThaiXP") List<String> trangThaiXP);

    @Query("""
    SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(
        lp.id, 
        lp.tenLoaiPhong, 
        lp.maLoaiPhong, 
        lp.dienTich, 
        lp.soKhachTieuChuan, 
        lp.soKhachToiDa, 
        lp.treEmTieuChuan, 
        lp.treEmToiDa, 
        lp.donGia, 
        lp.phuThuNguoiLon, 
        lp.phuThuTreEm, 
        lp.moTa, 
        lp.trangThai, 
        COUNT(p) AS soLuongPhong, 
        (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) 
         - COALESCE((
             SELECT COUNT(xp) 
             FROM XepPhong xp 
             WHERE xp.phong.loaiPhong.id = lp.id 
             AND xp.ngayNhanPhong <= :ngayTraPhong 
             AND xp.ngayTraPhong >= :ngayNhanPhong 
             AND xp.trangThai IN :trangThaiXP), 0)
         - COALESCE((
             SELECT COUNT(tp) 
             FROM ThongTinDatPhong tp 
             WHERE tp.loaiPhong.id = lp.id 
             AND tp.ngayNhanPhong <= :ngayTraPhong 
             AND tp.ngayTraPhong >= :ngayNhanPhong 
             AND tp.trangThai IN :trangThaiTTDP), 0)
        ) AS soPhongKhaDung
    )
    FROM LoaiPhong lp
    JOIN Phong p ON p.loaiPhong.id = lp.id
    WHERE p.trangThai = true
    GROUP BY lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, 
             lp.soKhachTieuChuan, lp.soKhachToiDa, lp.treEmTieuChuan, 
             lp.treEmToiDa, lp.donGia, lp.phuThuNguoiLon, lp.phuThuTreEm, 
             lp.moTa, lp.trangThai
    HAVING (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) 
            - COALESCE((
                SELECT COUNT(xp) 
                FROM XepPhong xp 
                WHERE xp.phong.loaiPhong.id = lp.id 
                AND xp.ngayNhanPhong <= :ngayTraPhong 
                AND xp.ngayTraPhong >= :ngayNhanPhong 
                AND xp.trangThai IN :trangThaiXP), 0)
            - COALESCE((
                SELECT COUNT(tp) 
                FROM ThongTinDatPhong tp 
                WHERE tp.loaiPhong.id = lp.id 
                AND tp.ngayNhanPhong <= :ngayTraPhong 
                AND tp.ngayTraPhong >= :ngayNhanPhong 
                AND tp.trangThai IN :trangThaiTTDP), 0)
           ) >= 1
""")
    List<LoaiPhongKhaDungResponse> findLoaiPhongKhaDungByTinhTrangResponseList(
            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
            @Param("trangThaiXP") List<String> trangThaiXP,
            @Param("trangThaiTTDP") List<String> trangThaiTTDP
    );

    @Query("""
    SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(
        lp.id, 
        lp.tenLoaiPhong, 
        lp.maLoaiPhong, 
        lp.dienTich, 
        lp.soKhachTieuChuan, 
        lp.soKhachToiDa, 
        lp.treEmTieuChuan, 
        lp.treEmToiDa, 
        lp.donGia, 
        lp.phuThuNguoiLon, 
        lp.phuThuTreEm, 
        lp.moTa, 
        lp.trangThai, 
        COUNT(p) AS soLuongPhong, 
        (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) 
         - COALESCE((
             SELECT COUNT(xp) 
             FROM XepPhong xp 
             WHERE xp.phong.loaiPhong.id = lp.id 
             AND xp.ngayNhanPhong <= :ngayTraPhong 
             AND xp.ngayTraPhong >= :ngayNhanPhong 
             AND xp.trangThai IN :trangThaiXP), 0)
         - COALESCE((
             SELECT COUNT(tp) 
             FROM ThongTinDatPhong tp 
             WHERE tp.loaiPhong.id = lp.id 
             AND tp.ngayNhanPhong <= :ngayTraPhong 
             AND tp.ngayTraPhong >= :ngayNhanPhong 
             AND tp.trangThai IN :trangThaiTTDP), 0)
        ) AS soPhongKhaDung
    )
    FROM LoaiPhong lp
    JOIN Phong p ON p.loaiPhong.id = lp.id
    WHERE p.trangThai = true
    AND lp.soKhachTieuChuan >= :soNguoi
    AND lp.treEmTieuChuan >= :treEm
    AND (:idLoaiPhong IS NULL OR lp.id = :idLoaiPhong)
    GROUP BY lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, 
             lp.soKhachTieuChuan, lp.soKhachToiDa, lp.treEmTieuChuan, 
             lp.treEmToiDa, lp.donGia, lp.phuThuNguoiLon, lp.phuThuTreEm, 
             lp.moTa, lp.trangThai
    HAVING (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) 
            - COALESCE((
                SELECT COUNT(xp) 
                FROM XepPhong xp 
                WHERE xp.phong.loaiPhong.id = lp.id 
                AND xp.ngayNhanPhong <= :ngayTraPhong 
                AND xp.ngayTraPhong >= :ngayNhanPhong 
                AND xp.trangThai IN :trangThaiXP), 0)
            - COALESCE((
                SELECT COUNT(tp) 
                FROM ThongTinDatPhong tp 
                WHERE tp.loaiPhong.id = lp.id 
                AND tp.ngayNhanPhong <= :ngayTraPhong 
                AND tp.ngayTraPhong >= :ngayNhanPhong 
                AND tp.trangThai IN :trangThaiTTDP), 0)
           ) >= :soPhong
""")
    List<LoaiPhongKhaDungResponse> findLPKDRList(
            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
            @Param("trangThaiXP") List<String> trangThaiXP,
            @Param("trangThaiTTDP") List<String> trangThaiTTDP,
            @Param("soNguoi") Integer soNguoi,
            @Param("soPhong") Integer soPhong,
            @Param("idLoaiPhong") Integer idLoaiPhong
    );

    @Query("""
    select ha from HinhAnh ha
    join Phong p ON ha.phong.id = p.id
    join LoaiPhong lp on lp.id = p.loaiPhong.id
    where lp.id = :idLoaiPhong
"""
    )
    List<HinhAnh> getAnhLP (int idLoaiPhong);


// ************************************   KHÔNG DÙNG ĐẾN   **********************************
//@Query(value = "SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(" +
//        "lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, lp.soKhachToiDa, " +
//        "lp.donGia, lp.donGiaPhuThu, lp.moTa, COUNT(p) AS soLuongPhong, " +
//        "(SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//        "(SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//        "  AND xp.ngayNhanPhong < CAST(:ngayTraPhong AS LocalDate) AND xp.ngayTraPhong > CAST(:ngayNhanPhong AS LocalDate) AND xp.trangThai IN (:trangThaiXP)) - " +
//        "(SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//        "  AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate) " +
//        "  AND tp.trangThai IN (:trangThaiTTDP))" +
//        ") AS soPhongKhaDung) " +
//        "FROM LoaiPhong lp " +
//        "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//        "WHERE p.trangThai = true " +
//        "GROUP BY lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, lp.soKhachToiDa, " +
//        "         lp.donGia, lp.donGiaPhuThu, lp.moTa " +
//        "HAVING (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//        "        (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//        "         AND xp.ngayNhanPhong < CAST(:ngayTraPhong AS LocalDate) AND xp.ngayTraPhong > CAST(:ngayNhanPhong AS LocalDate) " +
//        "         AND xp.trangThai IN (:trangThaiXP)) - " +
//        "        (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//        "         AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate) " +
//        "         AND tp.trangThai IN (:trangThaiTTDP))" +
//        ") >= 1")
//List<LoaiPhongKhaDungResponse> findLoaiPhongKhaDungResponseList(
//        @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
//        @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
//        List<String> trangThaiTTDP,
//        List<String> trangThaiXP);
//@Query("SELECT (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//        " (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = :roomTypeId " +
//        "    AND xp.ngayNhanPhong < :checkOut AND xp.ngayTraPhong > :checkIn " +
//        "    AND xp.trangThai = true) - " +
//        " (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = :roomTypeId " +
//        "    AND tp.ngayNhanPhong <= CAST(:checkOut AS date) " +
//        "    AND tp.ngayTraPhong >= CAST(:checkIn AS date) " +
//        "    AND tp.trangThai IN ('Da xep', 'Chua xep', 'Dang o', 'Den han'))" +
//        ") " +
//        "FROM Phong p " +
//        "WHERE p.loaiPhong.id = :roomTypeId AND p.trangThai = true")
//Integer getAvailableRoomCount(@Param("roomTypeId") Integer roomTypeId,
//                              @Param("checkIn") LocalDateTime checkIn,
//                              @Param("checkOut") LocalDateTime checkOut);
//    @Query(value = "SELECT new com.example.datn.dto.response.LoaiPhongResponse(" +
//            "lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, lp.soKhachToiDa, " +
//            "lp.donGia, lp.donGiaPhuThu, lp.moTa) " +
//            "FROM LoaiPhong lp " +
//            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//            "WHERE p.trangThai = true " +
//            "GROUP BY lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, lp.soKhachToiDa, " +
//            "         lp.donGia, lp.donGiaPhuThu, lp.moTa " +
//            "HAVING (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//            "        (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//            "         AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
//            "         AND xp.trangThai = true) - " +
//            "        (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//            "         AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS date) " +
//            "         AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS date) " +
//            "         AND tp.trangThai IN (:trangThaiTTDP))" +
//            ") >= :soPhong")
//    List<LoaiPhongResponse> findLoaiPhongResponse(
//            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
//            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
//            @Param("soPhong") Integer soPhong,
//            List<String> trangThaiTTDP);

//    @Query(value = "SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(lp.id, lp.tenLoaiPhong,lp.maLoaiPhong, lp.dienTich, " +
//            "lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa, COUNT(p) AS soLuongPhong, " +
//            "(COUNT(p) - " +
//            " (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//            " AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
//            " AND xp.trangThai = true) - " +
//            " (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//            " AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
//            " AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate) " +
//            " AND tp.trangThai IN (:trangThaiTTDP))" +
//            ") AS soPhongKhaDung) " +
//            "FROM LoaiPhong lp " +
//            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//            "WHERE p.trangThai = true " +
//            "AND lp.id = :loaiPhongId " + // Điều kiện tìm theo ID loại phòng
//            "GROUP BY lp.id, lp.tenLoaiPhong, lp.dienTich, lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa " +
//            "HAVING (COUNT(p) - " +
//            " (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//            " AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
//            " AND xp.trangThai = true) - " +
//            " (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//            " AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
//            " AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate))" +
//            ") > 0",
//            countQuery = "SELECT COUNT(DISTINCT lp.id) FROM LoaiPhong lp " +
//                    "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//                    "WHERE p.trangThai = true " +
//                    "AND lp.id = :loaiPhongId") // Điều kiện tìm theo ID loại phòng
//    LoaiPhongKhaDungResponse LoaiPhongKhaDung1(
//            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
//            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
//            @Param("loaiPhongId") Integer idLoaiPhong,
//            List<String> trangThaiTTDP);
//    @Query("SELECT (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//            "        (SELECT COUNT(xp) FROM XepPhong xp " +
//            "         WHERE xp.phong.loaiPhong.id = lp.id " +
//            "           AND xp.ngayNhanPhong < :ngayTraPhong " +
//            "           AND xp.ngayTraPhong > :ngayNhanPhong " +
//            "           AND xp.trangThai = true) - " +
//            "        (SELECT COUNT(tp) FROM ThongTinDatPhong tp " +
//            "         WHERE tp.loaiPhong.id = lp.id " +
//            "           AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
//            "           AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate) " +
//            "           AND tp.trangThai IN (:trangThaiTTDP))" +
//            ") " +
//            "FROM LoaiPhong lp " +
//            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//            "WHERE lp.id = :loaiPhongId " +
//            "GROUP BY lp.id")
//    Integer demSoPhongKhaDung(
//            @Param("loaiPhongId") Integer loaiPhongId,
//            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
//            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
//            List<String> trangThaiTTDP);

//    LoaiPhong findLoaiPhongById(@Param("idLoaiPhong") Integer idLoaiPhong);
//    @Query(value = "SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, " +
//            "lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa, COUNT(p) AS soLuongPhong, " +
//            "(SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//            " (SELECT COUNT(xp) " +
//            "  FROM XepPhong xp " +
//            "  WHERE xp.phong.loaiPhong.id = lp.id " +
//            "    AND xp.ngayNhanPhong < :ngayTraPhong " +
//            "    AND xp.ngayTraPhong > :ngayNhanPhong " +
//            "    AND xp.trangThai = true) -" +
//            " (SELECT COUNT(tp) " +
//            "  FROM ThongTinDatPhong tp " +
//            "  WHERE tp.loaiPhong.id = lp.id " +
//            "    AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
//            "    AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate) " +
//            "    AND tp.trangThai IN ('Chua xep'))" +
//            ") AS soPhongKhaDung) " +
//            "FROM LoaiPhong lp " +
//            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//            "WHERE lp.soKhachToiDa >= :soNguoi " +
//            "AND p.trangThai = true " +
//            "GROUP BY lp.id, lp.tenLoaiPhong, lp.dienTich, lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa " +
//            "HAVING (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//            " (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//            " AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
//            " AND xp.trangThai = true) - " +
//            " (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//            " AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
//            " AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate)" +
//            " AND tp.trangThai IN ('Da xep', 'Chua xep', 'Dang o', 'Den han'))" +
//            ") >= :soPhong",
//            countQuery = "SELECT COUNT(DISTINCT lp.id) FROM LoaiPhong lp " +
//                    "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//                    "WHERE lp.soKhachToiDa >= :soNguoi " +
//                    "AND p.trangThai = true")
//    Page<LoaiPhongKhaDungResponse> LoaiPhongKhaDung(
//            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
//            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
//            @Param("soNguoi") Integer soNguoi,
//            @Param("soPhong") Integer soPhong,
//            Pageable pageable);
//
//    @Query(value = "SELECT new com.example.datn.dto.response.   LoaiPhongKhaDungResponse(" +
//            "lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, lp.soKhachToiDa, " +
//            "lp.donGia, lp.donGiaPhuThu, lp.moTa, COUNT(p) AS soLuongPhong, " +
//            "(SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//            "(SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//            "AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
//            "AND xp.trangThai = true) - " +
//            "(SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//            "AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
//            "AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate) " +
//            "AND tp.trangThai IN ('Da xep', 'Chua xep', 'Dang o', 'Den han'))" +
//            ") AS soPhongKhaDung) " +
//            "FROM LoaiPhong lp " +
//            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//            "WHERE lp.soKhachToiDa >= :soKhach " +
//            "AND p.trangThai = true " +
//            "GROUP BY lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, lp.soKhachToiDa, lp.donGia, lp.donGiaPhuThu, lp.moTa " +
//            "HAVING (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//            "(SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//            "AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
//            "AND xp.trangThai = true) - " +
//            "(SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//            "AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS LocalDate) " +
//            "AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS LocalDate) " +
//            "AND tp.trangThai IN ('Da xep', 'Chua xep', 'Dang o', 'Den han'))" +
//            ") >= 1")
//    Page<LoaiPhongKhaDungResponse> findLoaiPhongKhaDung(
//            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
//            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
//            @Param("soKhach") Integer soKhach,
//            Pageable pageable);
//
//    @Query(value = "SELECT new com.example.datn.dto.response.LoaiPhongKhaDungResponse(" +
//            "lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, lp.soKhachToiDa, " +
//            "lp.donGia, lp.donGiaPhuThu, lp.moTa, COUNT(p), " +
//            "(SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//            " (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//            "  AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
//            "  AND xp.trangThai IN (:trangThaiXP)) - " +
//            " (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//            "  AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS date) " +
//            "  AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS date) " +
//            "  AND tp.trangThai IN (:trangThaiTTDP))" +
//            ") ) " +
//            "FROM LoaiPhong lp " +
//            "JOIN Phong p ON p.loaiPhong.id = lp.id " +
//            "WHERE lp.soKhachToiDa >= :soNguoi " +
//            "AND p.trangThai = true " +
//            "GROUP BY lp.id, lp.tenLoaiPhong, lp.maLoaiPhong, lp.dienTich, lp.soKhachToiDa, " +
//            "lp.donGia, lp.donGiaPhuThu, lp.moTa " +
//            "HAVING (SUM(CASE WHEN p.trangThai = true THEN 1 ELSE 0 END) - " +
//            " (SELECT COUNT(xp) FROM XepPhong xp WHERE xp.phong.loaiPhong.id = lp.id " +
//            "  AND xp.ngayNhanPhong < :ngayTraPhong AND xp.ngayTraPhong > :ngayNhanPhong " +
//            "  AND xp.trangThai IN (:trangThaiXP)) - " +
//            " (SELECT COUNT(tp) FROM ThongTinDatPhong tp WHERE tp.loaiPhong.id = lp.id " +
//            "  AND tp.ngayNhanPhong <= CAST(:ngayTraPhong AS date) " +
//            "  AND tp.ngayTraPhong >= CAST(:ngayNhanPhong AS date) " +
//            "  AND tp.trangThai IN (:trangThaiTTDP))" +
//            ") >= :soPhong")
//    List<LoaiPhongKhaDungResponse> findAllLPKDR(
//            @Param("ngayNhanPhong") LocalDateTime ngayNhanPhong,
//            @Param("ngayTraPhong") LocalDateTime ngayTraPhong,
//            @Param("soNguoi") Integer soNguoi,
//            @Param("soPhong") Integer soPhong,
//            List<String> trangThaiTTDP,
//            List<String> trangThaiXP);

}
