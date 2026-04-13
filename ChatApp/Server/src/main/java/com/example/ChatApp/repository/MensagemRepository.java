package com.example.ChatApp.repository;

import com.example.ChatApp.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem,Long> {

    // busca e carrega tudo de uma vez, pode melhorar depois
    @Query("SELECT m FROM Mensagem m WHERE m.sala.id = :salaId ORDER BY m.data DESC")
    List<Mensagem> findBySalaIdOrderByDataDesc(Long salaId);

}
