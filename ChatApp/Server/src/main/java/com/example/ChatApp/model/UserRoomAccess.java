package com.example.ChatApp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "user_room_access")
public class UserRoomAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "sala_id")
    private Sala sala;

    @Column(nullable = false)
    private LocalDateTime lastViewedAt;

    public UserRoomAccess(Client client, Sala sala, LocalDateTime lastViewedAt) {
        this.client = client;
        this.sala = sala;
        this.lastViewedAt = lastViewedAt;
    }
}
