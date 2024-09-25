package com.example.datn.service;

import com.example.datn.model.TienIch;

import java.util.List;

public interface TienIchService {
    List<TienIch> getAll();

    public void add(TienIch tienIch);

    public TienIch detail(Integer id);

    public void delete(Integer id);

    public void update(TienIch tienIch);
}
