package com.example.ChatApp.model;

import jakarta.persistence.*;

@Entity
@Table(name= "Client")
public class Client {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 45)
    private String email;

    @Column(nullable = false, length = 64)
    private String password;

    @Column(name = "name", nullable = false, length = 20)
    private String name;
}
