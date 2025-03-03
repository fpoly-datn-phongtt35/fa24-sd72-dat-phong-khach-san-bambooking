package com.example.datn.service;

import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.customer.CustomerRequests;
import com.example.datn.dto.request.customer.FilterRequest;
import com.example.datn.dto.response.customer.CustomerResponses;
import com.example.datn.model.KhachHang;

public interface KhachHangService {

    KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request);
    KhachHang updateKhachHangDatPhong(KhachHangDatPhongRequest request);

    void deleteKhachHangDatPhong(Integer idkh);

    CustomerResponses.CustomerTemplate getCustomers(FilterRequest request);

    void updateStatus(int id, boolean status);

    int storeCustomer(CustomerRequests.CustomerStore request);

    CustomerResponses.CustomerResponseBase getCustomer(Integer id);

    void updateCustomer(CustomerRequests.CustomerUpdate request, int id);
}
