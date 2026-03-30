package com.example.ChatApp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Mensagem")
public class Mensagem {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private Long client_id;

    @Column(nullable = false,length = 20)
    private Long sala_id;

    @Column(nullable = false,length = 200)
    private String mensagem;
}
