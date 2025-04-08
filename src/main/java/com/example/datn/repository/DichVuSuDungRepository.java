package com.example.datn.repository;

import com.example.datn.model.DichVuSuDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DichVuSuDungRepository extends JpaRepository<DichVuSuDung, Integer>{
    @Query("SELECT p FROM DichVuSuDung p WHERE p.dichVu.tenDichVu LIKE %:keyword%  and p.trangThai = true")
    List<DichVuSuDung> findByKeyword(@Param("keyword") String keyword);
    List<DichVuSuDung> findByXepPhongId(Integer id);

    @Query("SELECT p FROM DichVuSuDung p WHERE p.xepPhong.id = :idXepPhong and p.trangThai = true")
    public List<DichVuSuDung> getByIDXepPhong(Integer idXepPhong);

    @Query("SELECT p FROM DichVuSuDung p WHERE p.xepPhong.id = :idXepPhong and p.giaSuDung = 0")
    public List<DichVuSuDung> getByIDXepPhong2(Integer idXepPhong);

    @Query("SELECT p FROM DichVuSuDung p WHERE p.trangThai = true")
    public List<DichVuSuDung> getByTrangThai();

    // Thêm phương thức kiểm tra dịch vụ có tồn tại hay không
    boolean existsByDichVu_Id(Integer idDichVu);

}
