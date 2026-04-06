package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import com.exence.finance.modules.auth.entity.UserSettings;
import com.exence.finance.modules.auth.mapper.UserSettingsMapper;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.auth.service.UserSettingsService;
import com.exence.finance.modules.transaction.event.BaseCurrencyChangedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSettingsServiceImpl implements UserSettingsService {
    private final UserSettingsRepository userSettingsRepository;
    private final UserSettingsMapper userSettingsMapper;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @ReadTransactional
    public UserSettingsResponse getCurrentUserSettings() {
        return userSettingsMapper.toResponse(getCurrentSettings());
    }

    @Override
    @WriteTransactional
    public UserSettingsResponse updateCurrentUserSettings(UpdateUserSettingsRequest request) {
        UserSettings settings = getCurrentSettings();
        SupportedCurrency oldBaseCurrency = settings.getBaseCurrency();
        SupportedCurrency newBaseCurrency = request.baseCurrency();

        userSettingsMapper.updateFromRequest(request, settings);
        settings = userSettingsRepository.save(settings);

        if (newBaseCurrency != null && newBaseCurrency != oldBaseCurrency) {
            log.info(
                    "Base currency changed from {} to {} for user {}",
                    oldBaseCurrency,
                    newBaseCurrency,
                    settings.getUser().getId());
            // publish event instead of circular transactionService dependency
            eventPublisher.publishEvent(new BaseCurrencyChangedEvent(newBaseCurrency));
        }

        return userSettingsMapper.toResponse(settings);
    }

    private UserSettings getCurrentSettings() {
        Long userId = userService.getCurrentUserId();
        return userSettingsRepository
                .findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Settings not found for user " + userId));
    }

    public SupportedCurrency getUserBaseCurrency() {
        Long userId = userService.getCurrentUserId();
        return userSettingsRepository
                .findBaseCurrencyByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Settings not found for user " + userId));
    }
}
