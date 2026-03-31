package com.example.ChatApp.service;

import com.example.ChatApp.dto.LoginRequestDTO;
import com.example.ChatApp.dto.ClientResponseDTO;
import com.example.ChatApp.dto.RegisterRequestDTO;
import com.example.ChatApp.model.Client;
import com.example.ChatApp.repository.ClientRepository;
import com.example.ChatApp.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ClientService {

    // Criação de objetos Client repository ( irá fazer o contato com o banco)
    ClientRepository clientRepository;
    // Criação do objeto PasswordEncoder , responsavel por fazer o hash das senhas;
    PasswordEncoder passwordEncoder;
    // Objeto jwtService;
    JwtService jwtService;

    //Metodo construtor da classe;
    public ClientService(ClientRepository clientRepository,
                         PasswordEncoder passwordEncoder,
                         JwtService jwtService){
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // metodo de login
    public ClientResponseDTO login(LoginRequestDTO dto) {
        Optional<Client> optionalClient = clientRepository.findByEmail(dto.getEmail());
        if(optionalClient.isEmpty()){
            throw new RuntimeException("Email não cadastrado");
        }

        Client client = optionalClient.get();

        String token = jwtService.generateToken(client.getId());
        // validar senha
        if (!passwordEncoder.matches(dto.getPassword(), client.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        // montar resposta
        ClientResponseDTO response = new ClientResponseDTO();
        response.setId(client.getId());
        response.setName(client.getName());
        response.setEmail(client.getEmail());
        response.setToken(token);

        return response;
    }

    // metodo de registro
    public ClientResponseDTO register(RegisterRequestDTO dto) {
        //verificação se cadastro ja existe;
        Optional<Client> clientexists = clientRepository.findByEmail(dto.getEmail());
        if(clientexists.isPresent()){
            throw new RuntimeException("Email já cadastrado");
        }

        // criação de entidade cliente com dados inseridos;
        Client client = new Client();
        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setPassword(passwordEncoder.encode(dto.getPassword()));
        // Salva no banco o cliente novo;
        clientRepository.save(client);

        //Seta as variaveis da resposta que retorna;
        ClientResponseDTO response = new ClientResponseDTO();
        response.setId(client.getId());
        response.setName(client.getName());
        response.setEmail(client.getEmail());

        //Retorna a resposta de entidade cliente criada
        return response;
    }
}
