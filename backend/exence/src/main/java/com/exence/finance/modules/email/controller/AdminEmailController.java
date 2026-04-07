package com.exence.finance.modules.email.controller;

import com.exence.finance.modules.email.dto.BroadcastEmailRequest;
import org.springframework.http.ResponseEntity;

public interface AdminEmailController {

    ResponseEntity<Void> sendBroadcastEmail(BroadcastEmailRequest request);
}
