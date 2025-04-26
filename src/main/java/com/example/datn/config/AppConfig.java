package com.example.datn.config;

import com.example.datn.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AppConfig {

    private final UserService userService;
    private final PrevFilter prevFilter;

    private final String[] WHILE_LIST = {"/api/auth/**","/api/ttdp/**","/api/kh/**","/api/loai-phong/**","/api/tthd/**","/api/hoa-don/**","/api/dp/**","/api/tra-cuu/**"}; // Những đường dẫn không yêu cầu xác thực

    private final String[] URI_ADMIN = {"/api/*/customer/**", "/xep-phong/**", "/ttdp/**", "/tra-phong/**",
            "/tien-ich-phong/**", "/tien-ich/**", "/thong-tin-hoa-don/**", "/phong/**", "/loai-phong/**",
            "/khach-hang-checkin/**", "/hoa-don/**", "/dich_vu_su_dung/**", "/dich_vu_di_kem/**", "/dich_vu/**",
            "/dat-phong/**","/loai-phong/add" ,"thanh-toan/**","/dat-phong/xoa"};
    private final String[] URI_USER = {"/api/*/customer-client/**"}; // URL yêu cầu xác thực và có ROLE_USER


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .authorizeHttpRequests(request -> request.requestMatchers(WHILE_LIST).permitAll()
                        .requestMatchers(URI_ADMIN).hasAnyAuthority("Admin")
                        .requestMatchers(URI_USER).hasAnyAuthority("User")
                        .anyRequest().authenticated()
                )
                .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider()).addFilterBefore(this.prevFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManagerBean(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(this.userService.userDetailsService());
        return provider;
    }

    
}
