package com.example.ChatApp.service;

import com.example.ChatApp.dto.roomOp.MensagemDTO;
import com.example.ChatApp.dto.roomOp.MensagemRequestDTO;
import com.example.ChatApp.model.Client;
import com.example.ChatApp.model.Mensagem;
import com.example.ChatApp.model.Sala;
import com.example.ChatApp.repository.ClientRepository;
import com.example.ChatApp.repository.MensagemRepository;
import com.example.ChatApp.repository.SalaRepository;
import com.example.ChatApp.security.JwtService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ChatService {

    MensagemRepository mensagemRepository;
    ClientRepository clientRepository;
    SalaRepository salaRepository;
    JwtService jwtService;

    public ChatService(MensagemRepository mensagemRepository,
                       ClientRepository clientRepository,
                       SalaRepository salaRepository,
                       JwtService jwtService){
        this.mensagemRepository = mensagemRepository;
        this.clientRepository = clientRepository;
        this.salaRepository = salaRepository;
        this.jwtService = jwtService;
    }

    public MensagemDTO enviar(MensagemRequestDTO dto,Long client_id){

        //Pega objeto cliente
        //Long client_id = jwtService.extractUserId(token);
        Optional<Client> optionalClient = clientRepository.findById(client_id);
        Client client = optionalClient.get();

        // pega objeto sala
        Optional<Sala> optionalSala = salaRepository.findById(dto.getSala_id());
        Sala sala = optionalSala.get();

        //Monta mensagem
        Mensagem mensagem = new Mensagem();
        mensagem.setContent(dto.getContent());
        mensagem.setClient(client);
        mensagem.setSala(sala);
        mensagem.setData(LocalDateTime.now());

        System.out.println(mensagem);
        //Salva mensagem no banco de dados
        mensagemRepository.save(mensagem);

        MensagemDTO response = new MensagemDTO();
        response.setId(mensagem.getId());
        response.setCreator_name(mensagem.getClient().getName());
        response.setSala_Id(mensagem.getSala().getId());
        response.setData(mensagem.getData());
        response.setContent(mensagem.getContent());

        return response;
    }

}
