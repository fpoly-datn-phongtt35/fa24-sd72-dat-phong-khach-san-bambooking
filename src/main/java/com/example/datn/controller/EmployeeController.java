package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.dto.request.customer.CustomerRequests;
import com.example.datn.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.dto.request.employee.EmployeeRequests;
import com.example.datn.service.NhanVienService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

    @PatchMapping("/update-status/{id}")
    public ResponseData<?> updateStatus(@Min(value = 1, message = "Invalid id") @PathVariable int id, @RequestParam(required = true) boolean status) {
        log.info("PATCH/update-status: id {} status {}", id, status);
        this.nhanVienService.updateStatus(id, status);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "NO_CONTENT");
    }

    @GetMapping("/{id}")
    public ResponseData<?> getEmployee(@Min(value = 1, message = "Id phải lớn hơn 0") @Max(value = 10000, message = "ID Không hợp lệ") @PathVariable int id) {
        log.info("GET/employee: id {}", id);
        return new ResponseData<>(HttpStatus.OK.value(), "OK", this.nhanVienService.getEmployee(id));
    }

    @PutMapping("/{id}")
    public ResponseData<?> updateEmployee(
            @Min(value = 1, message = "Id phải lớn hơn 0") @Max(value = 10000, message = "ID Không hợp lệ") @PathVariable int id,
            @Valid @ModelAttribute EmployeeRequests.EmployeeUpdate request
    ) {
        log.info("PUT/employee");
        this.nhanVienService.updateEmployee(request, id);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "ACCEPTED");
    }
}
