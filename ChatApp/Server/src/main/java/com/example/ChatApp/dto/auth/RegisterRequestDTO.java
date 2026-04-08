package com.example.ChatApp.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {
    public String name;
    public String email;
    public String password;
}
