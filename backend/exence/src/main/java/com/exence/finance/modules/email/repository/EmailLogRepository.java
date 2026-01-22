package com.exence.finance.modules.email.repository;

import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.email.entity.EmailLog;
import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {

    @Query("SELECT COUNT(e) > 0 " + "FROM EmailLog e "
            + "WHERE e.user = :user "
            + "AND e.emailType = :emailType "
            + "AND e.sentAt > :after")
    boolean existsByUserAndEmailTypeAndSentAtAfter(
            @Param("user") User user, @Param("emailType") EmailType emailType, @Param("after") Instant after);
}
