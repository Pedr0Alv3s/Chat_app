package com.example.ChatApp.controller;


import com.example.ChatApp.dto.CreateSalaRequestDTO;
import com.example.ChatApp.dto.SalaResponseDTO;
import com.example.ChatApp.service.SalaService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
public class SalaController {

    SalaService salaService;

    public SalaController(SalaService salaService) {
        this.salaService = salaService;
    }

    @PostMapping("/create")
    public SalaResponseDTO create(@RequestBody CreateSalaRequestDTO dto,
                                  @RequestHeader("Authorization") String token){
        Long creator_id = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return salaService.create(dto, creator_id);
    }
}
