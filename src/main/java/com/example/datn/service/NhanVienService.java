package com.example.datn.service;

import com.example.datn.dto.request.NhanVienRequest;
import com.example.datn.dto.request.customer.CustomerRequests;
import com.example.datn.dto.request.customer.FilterRequest;
import com.example.datn.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.dto.request.employee.EmployeeRequests;
import com.example.datn.dto.response.customer.CustomerResponses;
import com.example.datn.dto.response.employee.EmployeeResponses;
import com.example.datn.model.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface NhanVienService {
    EmployeeResponses.EmployeeTemplate getEmployees(EmployeeFilterRequest request);

    void updateStatus(int id, boolean status);

    int storeEmployee(EmployeeRequests.EmployeeStore request);

    EmployeeResponses.EmployeeResponseBase getEmployee(Integer id);

    void updateEmployee(EmployeeRequests.EmployeeUpdate request, int id);
}
