package com.example.datn.dto.response.datphong;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ToHopPhongPhuHop {
    private List<Integer> phongs;
    private Integer tongSucChua;
    private Double tongChiPhi;
    private Integer tongSoPhong;
}
