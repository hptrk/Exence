package com.exence.finance.modules.auth.repository;

import com.exence.finance.modules.auth.entity.PasswordHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, Long> {

    @Query("SELECT ph " + "FROM PasswordHistory ph "
            + "WHERE ph.user.id = :userId "
            + "ORDER BY ph.createdAt DESC "
            + "LIMIT :limit")
    List<PasswordHistory> findRecentPasswordsByUserId(Long userId, int limit);
}
