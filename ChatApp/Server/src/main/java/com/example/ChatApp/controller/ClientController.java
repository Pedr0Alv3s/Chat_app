package com.example.ChatApp.controller;

import com.example.ChatApp.dto.ClientResponseDTO;
import com.example.ChatApp.dto.LoginRequestDTO;
import com.example.ChatApp.dto.RegisterRequestDTO;
import com.example.ChatApp.service.ClientService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class ClientController {
    //Criar Rota para autenticacao e registro;

    private final ClientService clientService;

    public ClientController(ClientService clientService){
        this.clientService = clientService;
    }

    @PostMapping("/login")
    public ClientResponseDTO login(@RequestBody LoginRequestDTO dto){
        return clientService.login(dto);
    }

    @PostMapping("/register")
    public ClientResponseDTO register(@RequestBody RegisterRequestDTO dto){
        return clientService.register(dto);
    }

}
