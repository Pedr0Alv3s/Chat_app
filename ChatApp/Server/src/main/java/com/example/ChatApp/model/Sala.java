package com.example.ChatApp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Sala")
public class Sala {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, length = 20)
    private Long creator_id;
}
