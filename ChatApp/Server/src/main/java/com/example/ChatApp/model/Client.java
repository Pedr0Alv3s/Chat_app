package com.example.ChatApp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
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

    @Column(length = 50)
    private String role;           // Cargo do usuário

    @Column(length = 50)
    private String department;     // Departamento

    @Column(length = 20)
    private String phone;          // Telefone de contato

    @ManyToMany(mappedBy = "clientList")
    private List<Sala> salaList;            //Lista de salas da qual o usuário tem acesso;
}
