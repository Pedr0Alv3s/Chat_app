package com.example.ChatApp.repository;

import com.example.ChatApp.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalaRepository extends JpaRepository<Sala,Long> {

}
