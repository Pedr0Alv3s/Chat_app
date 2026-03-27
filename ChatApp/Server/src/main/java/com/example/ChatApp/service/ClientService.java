package com.example.ChatApp.service;

import com.example.ChatApp.dto.LoginRequestDTO;
import com.example.ChatApp.dto.ClientResponseDTO;
import com.example.ChatApp.dto.RegisterRequestDTO;
import com.example.ChatApp.model.Client;
import com.example.ChatApp.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    ClientRepository clientRepository;
    PasswordEncoder passwordEncoder;

    public ClientService(ClientRepository clientRepository){
        this.clientRepository = clientRepository;
    }


    public ClientResponseDTO login(LoginRequestDTO dto) {
        Optional<Client> optionalClient = clientRepository.findByEmail(dto.getEmail());
        if(optionalClient.isEmpty()){
            throw new RuntimeException("Email não cadastrado");
        }

        Client client = optionalClient.get();

        // validar senha
        if (!passwordEncoder.matches(dto.getPassword(), client.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        // montar resposta
        ClientResponseDTO response = new ClientResponseDTO();
        response.setId(client.getId());
        response.setName(client.getName());
        response.setEmail(client.getEmail());

        return response;
    }

    public ClientResponseDTO register(RegisterRequestDTO dto) {
        //verificação se cadastro ja existe;
        Optional<Client> clientexists = clientRepository.findByEmail(dto.getEmail());
        if(clientexists.isPresent()){
            throw new RuntimeException("Email já cadastrado");
        }

        // criação de entiade cliente com dados inseridos;
        Client client = new Client();
        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setPassword(dto.getPassword());

        clientRepository.save(client);

        //Retorna a resposta de entidade cliente criada
        ClientResponseDTO response = new ClientResponseDTO();
        response.setId(client.getId());
        response.setName(client.getName());
        response.setEmail(client.getEmail());

        return response;
    }
}
