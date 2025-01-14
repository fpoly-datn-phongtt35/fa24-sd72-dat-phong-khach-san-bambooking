package com.example.datn.config;

import com.example.datn.dto.response.ExceptionResponse;
import com.example.datn.service.JwtService;
import com.example.datn.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

import static com.example.datn.common.TokenType.ACCESS_TOKEN;
import static org.apache.http.HttpHeaders.AUTHORIZATION;

@Component
@Slf4j
@RequiredArgsConstructor
public class PrevFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserService userService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, FilterChain filterChain) throws IOException {
        try {
            final String authorizationHeader = request.getHeader(AUTHORIZATION);
            if (StringUtils.isBlank(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }
            final String token = authorizationHeader.substring("Bearer ".length());
            String username = this.jwtService.extractUsername(token, ACCESS_TOKEN);
            if (StringUtils.isNotBlank(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userService.userDetailsService().loadUserByUsername(username);
                SecurityContext context = SecurityContextHolder.getContext();
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                context.setAuthentication(authenticationToken);
                SecurityContextHolder.setContext(context);
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error(e.getMessage());
            handleException(e, request, response);
        }
    }

    private void handleException(Exception e, @NonNull HttpServletRequest request, @NonNull HttpServletResponse response) throws IOException {
        if (e instanceof ExpiredJwtException) {
            log.error("Token expired");
            ExceptionResponse exceptionResponse = new ExceptionResponse();
            exceptionResponse.setTimestamp(new Date());
            exceptionResponse.setStatus(HttpServletResponse.SC_GONE);
            exceptionResponse.setPath(request.getRequestURI());
            exceptionResponse.setError("Token expired");
            exceptionResponse.setMessage(e.getMessage());

            response.setStatus(HttpServletResponse.SC_GONE);
            response.setContentType("application/json");
            ObjectMapper objectMapper = new ObjectMapper();
            response.getWriter().write(objectMapper.writeValueAsString(exceptionResponse));
        } else if (e instanceof SignatureException) {
            log.error("Invalid signature message={}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else if (e instanceof MalformedJwtException) {
            ExceptionResponse exceptionResponse = new ExceptionResponse();
            exceptionResponse.setTimestamp(new Date());
            exceptionResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionResponse.setPath(request.getRequestURI());
            exceptionResponse.setError("Fraud during authentication");
            exceptionResponse.setMessage("Please do not use tokens provided by others!");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            ObjectMapper objectMapper = new ObjectMapper();
            response.getWriter().write(objectMapper.writeValueAsString(exceptionResponse));
        } else {
            log.error("error={}", e.getMessage(), e.getCause());
        }
    }
}
