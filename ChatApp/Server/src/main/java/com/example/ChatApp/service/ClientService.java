package com.example.ChatApp.service;

import com.example.ChatApp.dto.LoginRequestDTO;
import com.example.ChatApp.dto.ClientResponseDTO;
import com.example.ChatApp.dto.RegisterRequestDTO;
import com.example.ChatApp.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    @Autowired
    ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository){
        this.clientRepository = clientRepository;
    }


    public ClientResponseDTO login(LoginRequestDTO dto) {
        
    }

    public ClientResponseDTO register(RegisterRequestDTO dto) {

    }
}
