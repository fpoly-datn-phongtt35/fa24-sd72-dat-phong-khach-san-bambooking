package com.example.datn.repository.customizeQuery;

import com.example.datn.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.dto.response.employee.EmployeeResponses;
import com.example.datn.model.Employee;
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
@Slf4j(topic = "CUSTOMIZE-QUERY-EMPLOYEE")
public class EmployeeRepository {
    @PersistenceContext
    private EntityManager entityManager;

    private static final String LIKE_FORMAT = "%%%s%%";

    public EmployeeResponses.EmployeeTemplate getAllEmployees(EmployeeFilterRequest request) {
        if (request.getPageNo() < 1) {
            request.setPageNo(1);
        }
        StringBuilder sql = new StringBuilder("SELECT e FROM Employee e");
        if (StringUtils.hasLength(request.getKeyword())) {
            sql.append(" WHERE( e.taiKhoan.tenDangNhap LIKE :keyword) or (e.sdt LIKE :keyword)");
        }

        TypedQuery<Employee> query = entityManager.createQuery(sql.toString(), Employee.class);
        if (StringUtils.hasLength(request.getKeyword())) {
            query.setParameter("keyword", String.format(LIKE_FORMAT, request.getKeyword()));
        }

        query.setFirstResult((request.getPageNo() - 1) * request.getPageSize());
        query.setMaxResults(request.getPageSize());

        List<Employee> resultList = query.getResultList();
        List<EmployeeResponses.EmployeeData> data = resultList.stream().map(s ->
                EmployeeResponses.EmployeeData.builder()
                        .id(s.getId())
                        .fullName(String.format("%s %s", s.getHo(), s.getTen()))
                        .username(s.getTaiKhoan().getUsername())
                        .gender(s.getGioiTinh())
                        .phoneNumber(s.getSdt())
                        .isLocked(s.getTaiKhoan().getTrangThai())
                        .build()
        ).toList();
        StringBuilder sqlCountPage = new StringBuilder("SELECT count(e) FROM Employee e");
        if (StringUtils.hasLength(request.getKeyword())) {
            sqlCountPage.append(" WHERE( e.taiKhoan.tenDangNhap LIKE :keyword) or (e.sdt LIKE :keyword)");
        }
        TypedQuery<Long> countQuery = entityManager.createQuery(sqlCountPage.toString(), Long.class);
        if (StringUtils.hasLength(request.getKeyword())) {
            countQuery.setParameter("keyword", String.format(LIKE_FORMAT, request.getKeyword()));
        }
        Long totalElements = countQuery.getSingleResult();
        Pageable pageable = PageRequest.of(request.getPageNo() - 1, request.getPageSize());
        Page<?> page = new PageImpl<>(data, pageable, totalElements);
        return EmployeeResponses.EmployeeTemplate.builder()
                .totalPage(page.getTotalPages())
                .pageNo(request.getPageNo())
                .pageSize(request.getPageSize())
                .data(data)
                .build();
    }
}
