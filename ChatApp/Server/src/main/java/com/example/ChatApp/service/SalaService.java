package com.example.ChatApp.service;

import com.example.ChatApp.dto.DashboardStatsDTO;
import com.example.ChatApp.dto.invite.InviteRequestDTO;
import com.example.ChatApp.dto.invite.InviteResponseDTO;
import com.example.ChatApp.dto.roomOp.*;
import com.example.ChatApp.model.Client;
import com.example.ChatApp.model.Mensagem;
import com.example.ChatApp.model.Sala;
import com.example.ChatApp.model.UserRoomAccess;
import com.example.ChatApp.repository.ClientRepository;
import com.example.ChatApp.repository.MensagemRepository;
import com.example.ChatApp.repository.SalaRepository;
import com.example.ChatApp.repository.UserRoomAccessRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SalaService {

    SalaRepository salaRepository;
    ClientRepository clientRepository;
    MensagemRepository mensagemRepository;
    UserRoomAccessRepository userRoomAccessRepository;

    // Seta objeto de Service referente a sala
    public SalaService(SalaRepository salaRepository,
            ClientRepository clientRepository,
            MensagemRepository mensagemRepository,
            UserRoomAccessRepository userRoomAccessRepository) {
        this.salaRepository = salaRepository;
        this.clientRepository = clientRepository;
        this.mensagemRepository = mensagemRepository;
        this.userRoomAccessRepository = userRoomAccessRepository;
    }

    public DashboardStatsDTO getDashboardStats(Long userId) {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);

        long messagesToday = mensagemRepository.countByUserIdAndDataAfter(userId, startOfDay);
        long unreadMessages = mensagemRepository.countUnreadMessages(userId);
        int activeGroups = salaRepository.findByClientList_Id(userId).size();

        return new DashboardStatsDTO(messagesToday, unreadMessages, activeGroups);
    }

    // Função create da sala
    public SalaResponseDTO create(CreateSalaRequestDTO dto, Long creator_id) {
        // ... (resto do método igual)
        Client client = clientRepository.findById(creator_id)
                .orElseThrow();

        Sala sala = new Sala();
        sala.setName(dto.name);
        sala.setCreator_id(creator_id);
        List<Client> clients = new ArrayList<>();
        clients.add(client);
        sala.setClientList(clients);
        salaRepository.save(sala);

        SalaResponseDTO response = new SalaResponseDTO();
        response.id = sala.getId();
        response.name = sala.getName();
        response.creator_id = sala.getCreator_id();
        return response;
    }

    // Metodo de convite para salas;
    public InviteResponseDTO invite(InviteRequestDTO dto, Long salaId) {
        Optional<Client> optionalClient = clientRepository.findByName(dto.getName());
        if (optionalClient.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        // procura sala por id recebido (provavelmente desnecessario)
        Sala sala = salaRepository.findById(salaId).orElseThrow();

        Client invitedClient = optionalClient.get();

        // evitar duplicação
        if (sala.getClientList().contains(invitedClient)) {
            throw new RuntimeException("Usuário já está na sala");
        }

        // adicionar usuário na sala
        sala.getClientList().add(invitedClient);

        // Construção da resposta e salvamento no BD;
        salaRepository.save(sala);
        InviteResponseDTO response = new InviteResponseDTO();
        response.setSala_id(salaId);
        response.setName(invitedClient.getName());

        return response;
    }

    // Metodo de acesso a pagina da sala, irá carregar as listas de
    // participantes e mensagens
    public AccessResponseDTO access(Long salaId, Long client_id) {

        // Buscar sala;
        Sala sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        // Valicação de pertencimento na lista da sala;
        boolean pertence = sala.getClientList() != null && sala.getClientList()
                .stream()
                .anyMatch(u -> u.getId().equals(client_id));

        if (!pertence) {
            throw new RuntimeException("Acesso negado");
        }

        // --- SISTEMA DE MARCAÇÃO DE LEITURA (PROTEGIDO) ---
        try {
            Optional<Client> optionalClient = clientRepository.findById(client_id);
            if (optionalClient.isPresent()) {
                Client client = optionalClient.get();
                UserRoomAccess access = userRoomAccessRepository
                        .findFirstByClientIdAndSalaIdOrderByIdDesc(client_id, salaId)
                        .orElse(new UserRoomAccess(client, sala, LocalDateTime.now()));

                access.setLastViewedAt(LocalDateTime.now());
                userRoomAccessRepository.save(access);
                System.out.println(">>> Marcado como lido: User " + client_id + " na Sala " + salaId);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Alerta: Erro ao marcar como lido (nao bloqueante): " + e.getMessage());
        }
        // ---------------------------------------------------

        // Mapear participantes -> monta lista com resposta de só alguns campos
        // selecionados no DTO
        List<ParticipanteDTO> client_list = new java.util.ArrayList<>();
        if (sala.getClientList() != null) {
            client_list = sala.getClientList()
                    .stream()
                    .map(u -> {
                        ParticipanteDTO dto = new ParticipanteDTO();
                        dto.setClient_id(u.getId());
                        dto.setName(u.getName());
                        return dto;
                    })
                    .toList();
        }

        // Mapear Mensagens
        List<Mensagem> mensagem_list = mensagemRepository.findBySalaIdOrderByDataDesc(salaId);

        List<MensagemDTO> mensagemDTOList = mensagem_list.stream()
                .map(m -> {
                    MensagemDTO dto = new MensagemDTO();
                    dto.setId(m.getId());
                    if (m.getClient() != null) {
                        dto.setCreator_name(m.getClient().getName());
                        dto.setCreator_Id(m.getClient().getId());
                    } else {
                        dto.setCreator_name("Usuário Desconhecido");
                        dto.setCreator_Id(0L);
                    }
                    dto.setContent(m.getContent());
                    dto.setData(m.getData());
                    return dto;
                }).toList();

        // Formação da resposta;
        AccessResponseDTO response = new AccessResponseDTO();
        response.setSala_id(salaId);
        response.setSala_name(sala.getName());
        response.setMensagem(mensagemDTOList);
        response.setParticipantes(client_list);

        return response;
    }

    // Listar todas as salas que o usuário participa
    public List<SalaResponseDTO> listMyRooms(Long clientId) {
        return salaRepository.findByClientList_Id(clientId)
                .stream()
                .map(sala -> {
                    SalaResponseDTO dto = new SalaResponseDTO();
                    dto.setId(sala.getId());
                    dto.setName(sala.getName());
                    dto.setCreator_id(sala.getCreator_id());
                    return dto;
                })
                .toList();
    }

    public void markAsRead(Long salaId, Long clientId) {
        try {
            Client client = clientRepository.findById(clientId).orElseThrow();
            Sala sala = salaRepository.findById(salaId).orElseThrow();

            UserRoomAccess access = userRoomAccessRepository
                    .findFirstByClientIdAndSalaIdOrderByIdDesc(clientId, salaId)
                    .orElse(new UserRoomAccess(client, sala, LocalDateTime.now()));

            access.setLastViewedAt(LocalDateTime.now());
            userRoomAccessRepository.save(access);
        } catch (Exception e) {
            System.err.println("⚠️ Erro ao marcar como lido (markAsRead): " + e.getMessage());
        }
    }
}
