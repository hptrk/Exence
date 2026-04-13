package com.exence.finance.modules.auth.repository;

import com.exence.finance.modules.auth.entity.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query(
            """
            SELECT u FROM User u WHERE u.emailVerified = true AND (
                NOT EXISTS (SELECT t FROM Transaction t WHERE t.createdBy = u.email)
                OR (SELECT MAX(t.createdAt) FROM Transaction t WHERE t.createdBy = u.email) < :threshold
            )
            """)
    List<User> findInactiveUsers(Instant threshold);
}
