package com.example.ChatApp.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    public String email;
    public String password;
}
