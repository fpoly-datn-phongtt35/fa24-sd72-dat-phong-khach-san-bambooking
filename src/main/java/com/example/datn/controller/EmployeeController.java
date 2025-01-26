package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.dto.request.customer.CustomerRequests;
import com.example.datn.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.dto.request.employee.EmployeeRequests;
import com.example.datn.service.NhanVienService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/${api.version}/employee")
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-CONTROLLER")
@Validated
public class EmployeeController {
    private final NhanVienService nhanVienService;
    @GetMapping
    public ResponseData<?> getEmployees(EmployeeFilterRequest request) {
        log.info("GET/employee: keyword {} pageNo {} pageSize {}", request.getKeyword(), request.getPageNo(), request.getPageSize());
        return new ResponseData<>(HttpStatus.OK.value(), "OK", this.nhanVienService.getEmployees(request));
    }

    @PostMapping
    public ResponseData<?> addEmployee(@Valid @ModelAttribute EmployeeRequests.EmployeeStore request) {
        log.info("POST/employee");
        return new ResponseData<>(HttpStatus.OK.value(), "OK", this.nhanVienService.storeEmployee(request));
    }
}
