package com.example.ChatApp.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequestDTO {
    private String name;
    private String email;
    private String role;
    private String department;
    private String phone;
}
