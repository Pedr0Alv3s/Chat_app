package com.example.ChatApp.controller;

import com.example.ChatApp.dto.ClientResponseDTO;
import com.example.ChatApp.dto.LoginRequestDTO;
import com.example.ChatApp.dto.RegisterRequestDTO;
import com.example.ChatApp.service.ClientService;
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

}
