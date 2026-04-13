package com.example.ChatApp.controller;

import com.example.ChatApp.dto.auth.ClientResponseDTO;
import com.example.ChatApp.dto.auth.LoginRequestDTO;
import com.example.ChatApp.dto.auth.RegisterRequestDTO;
import com.example.ChatApp.dto.auth.ProfileDTO;
import com.example.ChatApp.dto.auth.UpdateProfileRequestDTO;
import com.example.ChatApp.service.ClientService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class ClientController {
    //Criar Rota para autenticacao e registro;

    private final ClientService clientService;

    //Seta o objeto clientController
    public ClientController(ClientService clientService){
        this.clientService = clientService;
    }

    //Define Rota de post para login
    @PostMapping("/login")
    public ClientResponseDTO login(@RequestBody LoginRequestDTO dto){
        return clientService.login(dto);
    }

    //Define Rota de post para registro
    @PostMapping("/register")
    public ClientResponseDTO register(@RequestBody RegisterRequestDTO dto){
        return clientService.register(dto);
    }

    @GetMapping("/me")
    public ProfileDTO getMe() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return clientService.getProfile(userId);
    }

    @PutMapping("/profile")
    public ProfileDTO updateProfile(@RequestBody UpdateProfileRequestDTO dto) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return clientService.updateProfile(userId, dto);
    }

}
