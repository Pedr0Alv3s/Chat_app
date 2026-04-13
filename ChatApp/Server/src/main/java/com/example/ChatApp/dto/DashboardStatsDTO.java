package com.example.ChatApp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardStatsDTO {
    private long messagesToday;
    private long unreadMessages;
    private int activeGroups;
}
