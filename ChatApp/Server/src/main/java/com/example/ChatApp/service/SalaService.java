package com.example.ChatApp.service;

import com.example.ChatApp.dto.CreateSalaRequestDTO;
import com.example.ChatApp.dto.InviteRequestDTO;
import com.example.ChatApp.dto.InviteResponseDTO;
import com.example.ChatApp.dto.SalaResponseDTO;
import com.example.ChatApp.model.Client;
import com.example.ChatApp.model.Sala;
import com.example.ChatApp.repository.ClientRepository;
import com.example.ChatApp.repository.SalaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SalaService {

    SalaRepository salaRepository;
    ClientRepository clientRepository;
    //Seta objeto de Service referente a sala
    public SalaService(SalaRepository salaRepository,ClientRepository clientRepository){
        this.salaRepository = salaRepository;
        this.clientRepository = clientRepository;
    }

    //Função create da sala
    public SalaResponseDTO create(CreateSalaRequestDTO dto,Long creator_id){

        Client client = clientRepository.findById(creator_id)
                .orElseThrow();

        Sala sala = new Sala();
        sala.setName(dto.name);
        sala.setCreator_id(creator_id);
        List<Client> clients = new ArrayList<>();
        clients.add(client);
        sala.setClient_list(clients);
        salaRepository.save(sala);

        SalaResponseDTO response = new SalaResponseDTO();
        response.name = sala.getName();
        response.creator_id = sala.getCreator_id();
        return response;
    }

    //Metodo de convite para salas;
    public InviteResponseDTO invite(InviteRequestDTO dto,Long salaId){
        Optional<Client> optionalClient = clientRepository.findByName(dto.getName());
        if(optionalClient.isEmpty()){
            throw new RuntimeException("Usuário não encontrado");
        }

        //procura sala por id recebido (provavelmente desnecessario)
        Sala sala = salaRepository.findById(salaId).orElseThrow();

        Client invitedClient = optionalClient.get();

        // evitar duplicação
        if (sala.getClient_list().contains(invitedClient)) {
            throw new RuntimeException("Usuário já está na sala");
        }

        // adicionar usuário na sala
        sala.getClient_list().add(invitedClient);

        // Construção da resposta e salvamento no BD;
        salaRepository.save(sala);
        InviteResponseDTO response = new InviteResponseDTO();
        response.setSala_id(salaId);
        response.setName(invitedClient.getName());

        return response;
    }

}
