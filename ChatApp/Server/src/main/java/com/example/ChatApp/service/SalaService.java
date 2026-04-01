package com.example.ChatApp.service;

import com.example.ChatApp.dto.invite.InviteRequestDTO;
import com.example.ChatApp.dto.invite.InviteResponseDTO;
import com.example.ChatApp.dto.roomOp.*;
import com.example.ChatApp.model.Client;
import com.example.ChatApp.model.Mensagem;
import com.example.ChatApp.model.Sala;
import com.example.ChatApp.repository.ClientRepository;
import com.example.ChatApp.repository.MensagemRepository;
import com.example.ChatApp.repository.SalaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SalaService {

    SalaRepository salaRepository;
    ClientRepository clientRepository;
    MensagemRepository mensagemRepository;
    //Seta objeto de Service referente a sala
    public SalaService(SalaRepository salaRepository,
                       ClientRepository clientRepository,
                       MensagemRepository mensagemRepository){
        this.salaRepository = salaRepository;
        this.clientRepository = clientRepository;
        this.mensagemRepository = mensagemRepository;
    }

    //Função create da sala
    public SalaResponseDTO create(CreateSalaRequestDTO dto, Long creator_id){

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
    public InviteResponseDTO invite(InviteRequestDTO dto, Long salaId){
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

    //Metodo de acesso a pagina da sala, irá carregar as listas de
    //participantes e mensagens
    public AccessResponseDTO access(Long salaId, Long client_id) {

        // retornar a lista de mensagens referente a cada sala individual;
        // retornar a lista de pessoas conectadas ( implementar dps o esquema de
        // verificação por tempo);

        // Buscar sala;
        Sala sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        //Valicação de pertencimento na lista da sala;
        boolean pertence = sala.getClient_list()
                .stream()
                .anyMatch(u -> u.getId().equals(client_id));

        if(!pertence){
            throw new RuntimeException("Acesso negado");
        }

        //Mapear participantes -> monta lista com resposta de só alguns campos selecionados no DTO
        List<ParticipanteDTO> client_list= sala.getClient_list()
                .stream()
                .map(u -> {
                    ParticipanteDTO dto = new ParticipanteDTO();
                    dto.setClient_id(u.getId());
                    dto.setName(u.getName());
                    return dto;
                })
                .toList();

        //Mapear Mensagens

            //Busca mensagem -> filtra por salaId -> usa .map para montar a lista->
            // -> lista incorpora a response
        List<Mensagem> mensagem_list = mensagemRepository.findByIdOrderByData(salaId);

        List<MensagemDTO> mensagemDTOList = mensagem_list.stream()
                .map(m->{
                    MensagemDTO dto = new MensagemDTO();
                    dto.setId(m.getId());
                    dto.setCreator_name(m.getClient().getName());
                    dto.setCreator_Id(m.getClient().getId());
                    dto.setContent(m.getContent());
                    dto.setData(m.getData());
                    return dto;
                }).toList();

        //Formação da resposta;
        AccessResponseDTO response = new AccessResponseDTO();
        response.setSala_id(salaId);
        response.setSala_name(sala.getName());
        response.setMensagem(mensagemDTOList);
        response.setParticipantes(client_list);

        return response;
    }
}
