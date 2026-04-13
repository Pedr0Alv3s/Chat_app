package com.example.ChatApp.service;

import com.example.ChatApp.dto.auth.LoginRequestDTO;
import com.example.ChatApp.dto.auth.ClientResponseDTO;
import com.example.ChatApp.dto.auth.RegisterRequestDTO;
import com.example.ChatApp.model.Client;
import com.example.ChatApp.repository.ClientRepository;
import com.example.ChatApp.repository.MensagemRepository;
import com.example.ChatApp.repository.SalaRepository;
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
    MensagemRepository mensagemRepository;
    SalaRepository salaRepository;

    //Metodo construtor da classe;
    public ClientService(ClientRepository clientRepository,
                         PasswordEncoder passwordEncoder,
                         JwtService jwtService,
                         MensagemRepository mensagemRepository,
                         SalaRepository salaRepository){
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mensagemRepository = mensagemRepository;
        this.salaRepository = salaRepository;
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

    public com.example.ChatApp.dto.auth.ProfileDTO getProfile(Long userId) {
        Client client = clientRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        com.example.ChatApp.dto.auth.ProfileDTO profile = new com.example.ChatApp.dto.auth.ProfileDTO();
        profile.setId(client.getId());
        profile.setName(client.getName());
        profile.setEmail(client.getEmail());
        profile.setRole(client.getRole());
        profile.setDepartment(client.getDepartment());
        profile.setPhone(client.getPhone());
        
        // Contar mensagens e salas
        profile.setMessagesCount(mensagemRepository.countByClientId(userId));
        profile.setRoomsCount(salaRepository.countByClientList_Id(userId));

        return profile;
    }

    public com.example.ChatApp.dto.auth.ProfileDTO updateProfile(Long userId, com.example.ChatApp.dto.auth.UpdateProfileRequestDTO dto) {
        Client client = clientRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (dto.getName() != null) client.setName(dto.getName());
        if (dto.getEmail() != null) {
            // Verificar se novo email ja existe em outro usuario
            Optional<Client> existing = clientRepository.findByEmail(dto.getEmail());
            if (existing.isPresent() && !existing.get().getId().equals(userId)) {
                throw new RuntimeException("Email já está sendo usado");
            }
            client.setEmail(dto.getEmail());
        }
        if (dto.getRole() != null) client.setRole(dto.getRole());
        if (dto.getDepartment() != null) client.setDepartment(dto.getDepartment());
        if (dto.getPhone() != null) client.setPhone(dto.getPhone());

        clientRepository.save(client);
        return getProfile(userId);
    }
}
