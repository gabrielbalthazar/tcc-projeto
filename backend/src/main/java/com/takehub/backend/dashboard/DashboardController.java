package com.takehub.backend.dashboard;

import com.takehub.backend.dashboard.dto.DashboardResponse;
import com.takehub.backend.dashboard.dto.PrazoProximo;
import com.takehub.backend.dashboard.dto.ProjetoProgresso;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getData() {
        return ResponseEntity.ok(dashboardService.getData());
    }

    @GetMapping("/projetos")
    public ResponseEntity<List<ProjetoProgresso>> getProjetos() {
        return ResponseEntity.ok(dashboardService.getProjetos());
    }

    @GetMapping("/prazos")
    public ResponseEntity<List<PrazoProximo>> getPrazos() {
        return ResponseEntity.ok(dashboardService.getPrazos());
    }
}
