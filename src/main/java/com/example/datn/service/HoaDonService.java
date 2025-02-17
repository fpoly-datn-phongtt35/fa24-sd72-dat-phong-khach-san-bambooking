package com.example.datn.service;

import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.model.HoaDon;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


/**
 * Đây là Service interface cho xử lý hóa đơn
 */
public interface HoaDonService {
    /**
     * Lấy danh sách hóa đơn theo trạng thái, keyword và có sử dụng phân trang để hiển thị
     *
     * @param trangThai: trạng thái của hóa đơn(Exp: Chưa thanh toán, chờ xác nhận, đã thanh toán)
     * @param keyword:   từ khóa tìm kiếm người dùng nhập vào
     * @param pageable:  thông tin phân trang
     * @return danh sách hóa đơn theo phân trang
     */
    Page<HoaDonResponse> getHoaDonByTrangThai(String trangThai, String keyword, Pageable pageable);

    /**
     * Tạo mới 1 hóa đơn
     *
     * @param request: gọi từ auth để lấy và bóc tách username
     * @param idTraPhong: dùng 1 hàm find idTraPhong để lấy ra idDatPhong trực tiếp khi trả phòng
     *                  và set luôn idDatPhong mới được trả về vào hóa đơn.
     * @return hóa đơn được tạo thành công: 201
     */
    HoaDon createHoaDon(HttpServletRequest request, Integer idTraPhong);

    /**
     * Lấy thông tin chi tiết của một hóa đơn.
     *
     * @param idHoaDon ID của hóa đơn.
     * @return Thông tin hóa đơn.
     */
    HoaDonResponse getOneHoaDon(Integer idHoaDon);

    /**
     * Thay đổi trạng thái của hóa đơn.
     *
     * @param id ID hóa đơn cần cập nhật trạng thái.
     * @return `true` nếu cập nhật thành công, `false` nếu thất bại.
     */
    Boolean changeStatusHoaDon(Integer id);
}
