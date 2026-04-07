package com.exence.finance.modules.email.service;

import com.exence.finance.modules.email.dto.BroadcastEmailRequest;

public interface AdminEmailService {

    void sendBroadcastEmailToAllUsers(BroadcastEmailRequest request);
}
