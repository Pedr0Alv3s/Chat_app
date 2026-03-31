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
@Table(name = "Mensagem")
public class Mensagem {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="client_id",insertable = false, updatable = false)
    private Client client;         //id do usuário que enviou a mensagem

    @ManyToOne
    @JoinColumn(name="sala_id",insertable = false, updatable = false)
    private Sala sala;           //id da sala a qual pertence

    @Column(nullable = false,length = 200)
    private String content;         //conteudo da mensagem

    @Column(nullable = false)
    private LocalDateTime data;     //data de envio da mensagem
}
