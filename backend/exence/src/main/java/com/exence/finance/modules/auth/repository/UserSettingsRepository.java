package com.exence.finance.modules.auth.repository;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.entity.UserSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUserId(Long userId);

    @Query("SELECT us.baseCurrency FROM UserSettings us WHERE us.user.id = :userId")
    Optional<SupportedCurrency> findBaseCurrencyByUserId(@Param("userId") Long userId);
}
