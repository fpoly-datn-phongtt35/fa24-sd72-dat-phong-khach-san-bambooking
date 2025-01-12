package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.dto.request.customer.CustomerRequest;
import com.example.datn.dto.request.customer.FilterRequest;
import com.example.datn.service.KhachHangService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/${api.version}/customer")
@RequiredArgsConstructor
@Slf4j(topic = "CUSTOMER-CONTROLLER")
@Validated
public class CustomerController {

    private final KhachHangService customerService;

    @GetMapping
    public ResponseData<?> getCustomers( FilterRequest request) {
        log.info("GET/customer: keyword {} pageNo {} pageSize {}", request.getKeyword(), request.getPageNo(), request.getPageSize());
        return new ResponseData<>(HttpStatus.OK.value(), "OK", this.customerService.getCustomers(request));
    }

    @PatchMapping("/update-status/{id}")
    public ResponseData<?> updateStatus(@Min(value = 1, message = "Invalid id") @PathVariable int id, @RequestParam(required = true) boolean status) {
        log.info("PATCH/update-status: id {} status {}", id, status);
        this.customerService.updateStatus(id, status);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "NO_CONTENT");
    }

    @PostMapping
    public ResponseData<?> addCustomer(@Valid @ModelAttribute CustomerRequest request) {
        log.info("POST/customer");
        return new ResponseData<>(HttpStatus.OK.value(), "OK", this.customerService.storeCustomer(request));
    }
}
