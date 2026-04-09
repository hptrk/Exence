package com.exence.finance.modules.systemsettings.repository;

import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {}
