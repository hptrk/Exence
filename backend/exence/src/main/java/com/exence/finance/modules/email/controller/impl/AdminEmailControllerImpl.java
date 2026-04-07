package com.exence.finance.modules.email.controller.impl;

import com.exence.finance.modules.email.controller.AdminEmailController;
import com.exence.finance.modules.email.dto.BroadcastEmailRequest;
import com.exence.finance.modules.email.service.AdminEmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/email")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AdminEmailControllerImpl implements AdminEmailController {

    private final AdminEmailService adminEmailService;

    @Override
    @PostMapping("/broadcast")
    public ResponseEntity<Void> sendBroadcastEmail(@Valid @RequestBody BroadcastEmailRequest request) {
        adminEmailService.sendBroadcastEmailToAllUsers(request);
        return ResponseEntity.ok().build();
    }
}
