package com.example.ChatApp;

import com.example.ChatApp.model.Client;
import com.example.ChatApp.model.Sala;
import com.example.ChatApp.repository.ClientRepository;
import com.example.ChatApp.repository.SalaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final SalaRepository salaRepository;

    public DataInitializer(ClientRepository clientRepository, SalaRepository salaRepository) {
        this.clientRepository = clientRepository;
        this.salaRepository = salaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Criar Sala de teste se não existir
        if (salaRepository.count() == 0) {
            Sala sala = new Sala();
            sala.setName("Geral");
            sala.setCreator_id(1L);
            salaRepository.save(sala);
            System.out.println("Sala mockada inserida no BD com sucesso.");
        }

        // Criar Client (User) de teste se não existir com ID 1
        if (clientRepository.count() == 0) {
            Client client = new Client();
            client.setName("Angelo");
            client.setEmail("angelo@teste.com");
            client.setPassword("$2a$10$6H3YVv6F6H7X7V0X7V0X7V0X7V0X7V0X7V0X7V0X7V0X7V0X7V0X7"); // Mock hash para '123456'
            client.setRole("Desenvolvedor Full Stack");
            client.setDepartment("Engenharia de Software");
            client.setPhone("+55 (11) 98888-7777");
            clientRepository.save(client);
            System.out.println("Usuário mockado inserido no BD com sucesso.");
        }
    }
}
