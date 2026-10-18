package com.takehub.backend.dashboard.dto;

public record StatCard(
        String icon,
        long value,
        String label,
        String color
) {
}
