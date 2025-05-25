package com.example.datn.service;
import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.model.HinhAnh;
import com.example.datn.model.LoaiPhong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LoaiPhongService {

    List<LoaiPhong> getAllLoaiPhong();

    Page<LoaiPhongResponse> getPage(Pageable pageable);

    public LoaiPhong add(LoaiPhongRequest loaiPhong);

    public LoaiPhong detail(Integer id);

    public void delete(Integer id);

    LoaiPhong update(LoaiPhongRequest loaiPhongRequest);

    Page<LoaiPhong> filter ( String tenLoaiPhong,
                            Integer dienTichMin,
                            Integer dienTichMax,
                            Integer soKhachTieuChuan,
                            Integer soKhachToiDa,
                            Integer treEmTieuChuan,
                            Integer treEmToiDa,
                            Double donGiaMin,
                            Double donGiaMax,
                            Double phuThuNguoiLonMin,
                            Double phuThuNguoiLonMax,
                            Double phuThuTreEmMin,
                            Double phuThuTreEmMax,
                            Boolean trangThai,
                            Pageable pageable);

    LoaiPhong findByID(Integer idLoaiPhong);

    List<HinhAnh> getAnhLP(Integer idLoaiPhong);
    Optional<LoaiPhong> findById(int id);
}
