package com.exence.finance.modules.email.service.impl;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.email.dto.BroadcastEmailRequest;
import com.exence.finance.modules.email.service.EmailService;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AdminEmailServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AdminEmailServiceImpl service;

    @Test
    @DisplayName("send broadcast email all users")
    void sendBroadcastEmailToAllUsers_allUsers() {
        // given
        User user1 = UserTestFixtures.defaultUser();
        User user2 = UserTestFixtures.adminUser();
        given(userRepository.findAll()).willReturn(List.of(user1, user2));

        BroadcastEmailRequest request = new BroadcastEmailRequest("Monthly Update", "<p>Hello!</p>");

        // when
        service.sendBroadcastEmailToAllUsers(request);

        // then
        then(emailService).should().sendBroadcastEmail(user1, "Monthly Update", "<p>Hello!</p>");
        then(emailService).should().sendBroadcastEmail(user2, "Monthly Update", "<p>Hello!</p>");
    }

    @Test
    @DisplayName("send broadcast email no users")
    void sendBroadcastEmailToAllUsers_noUsers() {
        // given
        given(userRepository.findAll()).willReturn(List.of());

        BroadcastEmailRequest request = new BroadcastEmailRequest("Update", "<p>Hi</p>");

        // when
        service.sendBroadcastEmailToAllUsers(request);

        // then
        then(emailService).shouldHaveNoInteractions();
    }
}
