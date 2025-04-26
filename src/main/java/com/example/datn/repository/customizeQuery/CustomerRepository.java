package com.example.datn.repository.customizeQuery;

import com.example.datn.dto.request.customer.FilterRequest;
import com.example.datn.dto.response.customer.CustomerResponses;
import com.example.datn.model.KhachHang;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j(topic = "CUSTOMIZE-QUERY-CUSTOMER")
public class CustomerRepository {

    @PersistenceContext
    private EntityManager entityManager;

    private static final String LIKE_FORMAT = "%%%s%%";

    public CustomerResponses.CustomerTemplate getAllCustomers(FilterRequest request) {
        if (request.getPageNo() < 1) {
            request.setPageNo(1);
        }
        
        StringBuilder sql = new StringBuilder("SELECT c FROM KhachHang c LEFT JOIN c.taiKhoan tk");
        if (StringUtils.hasLength(request.getKeyword())) {
            sql.append(" WHERE (tk.tenDangNhap LIKE :keyword OR c.sdt LIKE :keyword)");
        }
        sql.append(" ORDER BY c.id DESC");

        TypedQuery<KhachHang> query = entityManager.createQuery(sql.toString(), KhachHang.class);
        if (StringUtils.hasLength(request.getKeyword())) {
            query.setParameter("keyword", String.format(LIKE_FORMAT, request.getKeyword()));
        }

        query.setFirstResult((request.getPageNo() - 1) * request.getPageSize());
        query.setMaxResults(request.getPageSize());

        List<KhachHang> resultList = query.getResultList();
        List<CustomerResponses.CustomerData> data = resultList.stream().map(s ->
                CustomerResponses.CustomerData.builder()
                        .id(s.getId())
                        .fullName(String.format("%s %s", s.getHo(), s.getTen()))
                        .username(s.getTaiKhoan() != null ? s.getTaiKhoan().getUsername() : null)
                        .gender(s.getGioiTinh())
                        .phoneNumber(s.getSdt())
                        .isLocked(s.getTaiKhoan() != null ? s.getTaiKhoan().getTrangThai() : false) // Giá trị mặc định nếu không có tài khoản
                        .avatar(s.getAvatar())
                        .build()
        ).toList();

        StringBuilder sqlCountPage = new StringBuilder("SELECT count(c) FROM KhachHang c LEFT JOIN c.taiKhoan tk");
        if (StringUtils.hasLength(request.getKeyword())) {
            sqlCountPage.append(" WHERE (tk.tenDangNhap LIKE :keyword OR c.sdt LIKE :keyword)");
        }
        TypedQuery<Long> countQuery = entityManager.createQuery(sqlCountPage.toString(), Long.class);
        if (StringUtils.hasLength(request.getKeyword())) {
            countQuery.setParameter("keyword", String.format(LIKE_FORMAT, request.getKeyword()));
        }
        Long totalElements = countQuery.getSingleResult();

        Pageable pageable = PageRequest.of(request.getPageNo() - 1, request.getPageSize());
        Page<?> page = new PageImpl<>(data, pageable, totalElements);
        return CustomerResponses.CustomerTemplate.builder()
                .totalPage(page.getTotalPages())
                .pageNo(request.getPageNo())
                .pageSize(request.getPageSize())
                .data(data)
                .build();
    }
}
