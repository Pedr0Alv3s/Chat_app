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
    List<Mensagem> findBySalaIdOrderByDataDesc(@org.springframework.data.repository.query.Param("salaId") Long salaId);

    @Query("SELECT COUNT(m) FROM Mensagem m JOIN m.sala s JOIN s.clientList c WHERE c.id = :userId AND m.data >= :since")
    long countByUserIdAndDataAfter(@org.springframework.data.repository.query.Param("userId") Long userId, @org.springframework.data.repository.query.Param("since") LocalDateTime since);

    @Query("SELECT COUNT(m) FROM Mensagem m " +
           "JOIN m.sala s " +
           "JOIN s.clientList c " +
           "LEFT JOIN UserRoomAccess ura ON ura.client.id = c.id AND ura.sala.id = s.id " +
           "WHERE c.id = :userId AND (ura.lastViewedAt IS NULL OR m.data > ura.lastViewedAt)")
    long countUnreadMessages(@org.springframework.data.repository.query.Param("userId") Long userId);

    long countByClientId(Long clientId);
}
