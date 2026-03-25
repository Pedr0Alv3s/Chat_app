package com.example.ChatApp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ClientController {

    //Criar Rota para autenticacao e registro;
    // campos = nome , email e senha;

    @RequestMapping("/auth")
    @ResponseBody
    public String AuthResp(){
        return "Hello";
    }

}
