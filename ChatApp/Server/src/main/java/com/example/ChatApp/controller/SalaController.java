package com.example.ChatApp.controller;

import com.example.ChatApp.dto.roomOp.CreateSalaRequestDTO;
import com.example.ChatApp.dto.invite.InviteRequestDTO;
import com.example.ChatApp.dto.invite.InviteResponseDTO;
import com.example.ChatApp.dto.roomOp.SalaResponseDTO;
import com.example.ChatApp.dto.roomOp.AccessResponseDTO;
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
    //Rota de criação da sala
    @PostMapping("/create")
    public SalaResponseDTO create(@RequestBody CreateSalaRequestDTO dto,
                                  @RequestHeader("Authorization") String token){
        Long creator_id = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return salaService.create(dto, creator_id);
    }
    //Rota de convite para sala
    @PostMapping("/{salaId}/invite")
    public InviteResponseDTO invite(@PathVariable Long salaId,
                                    @RequestHeader("Authorization") String token,
                                    @RequestBody InviteRequestDTO dto){

        return salaService.invite(dto,salaId);
    }

    //Rota para acessar a sala
    @GetMapping("/{salaId}/access")
    public AccessResponseDTO access(@PathVariable Long salaId,
                                    @RequestHeader("Authorization") String token){
        Long client_id = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return salaService.access(salaId,client_id);
    }
}
