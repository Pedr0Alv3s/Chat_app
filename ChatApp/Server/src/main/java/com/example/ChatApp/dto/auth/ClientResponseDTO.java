package com.example.ChatApp.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientResponseDTO {
    public Long id;
    public String token;
    public String name;
    public String email;
}
