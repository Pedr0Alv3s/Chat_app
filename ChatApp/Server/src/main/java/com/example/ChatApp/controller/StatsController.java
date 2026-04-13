package com.example.ChatApp.controller;

import com.example.ChatApp.dto.DashboardStatsDTO;
import com.example.ChatApp.service.SalaService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    private final SalaService salaService;

    public StatsController(SalaService salaService) {
        this.salaService = salaService;
    }

    @GetMapping("/dashboard")
    public DashboardStatsDTO getDashboardStats(@RequestHeader("Authorization") String token) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return salaService.getDashboardStats(userId);
    }
}
