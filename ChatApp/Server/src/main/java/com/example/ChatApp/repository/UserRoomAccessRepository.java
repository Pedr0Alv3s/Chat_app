package com.example.ChatApp.repository;

import com.example.ChatApp.model.UserRoomAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRoomAccessRepository extends JpaRepository<UserRoomAccess, Long> {
    java.util.Optional<UserRoomAccess> findFirstByClientIdAndSalaIdOrderByIdDesc(Long clientId, Long salaId);
}
