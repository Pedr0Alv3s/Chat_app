package com.example.ChatApp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 🔹 1. Pega o header
        String authHeader = request.getHeader("Authorization");
        System.out.println(">>> JwtFilter executado");
        // 🔹 2. Verifica se existe token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            // 🔹 3. Valida token
            if (jwtService.isValid(token)) {

                Long userId = jwtService.extractUserId(token);

                // 🔹 4. Cria autenticação
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.emptyList()
                        );

                // 🔹 5. Salva no contexto do Spring
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 🔹 6. Continua a requisição
        filterChain.doFilter(request, response);
    }
}
