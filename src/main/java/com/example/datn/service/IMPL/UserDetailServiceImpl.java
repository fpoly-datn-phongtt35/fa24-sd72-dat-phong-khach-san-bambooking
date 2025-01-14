package com.example.datn.service.IMPL;

import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserService {
    private final TaiKhoanRepository userRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return userRepository::findByUsername;
    }
}
