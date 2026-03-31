package com.example.ChatApp.repository;

import com.example.ChatApp.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client,Long>{


    Optional<Client> findByEmail(String email);

    Optional<Client> findByName(String name);
}
