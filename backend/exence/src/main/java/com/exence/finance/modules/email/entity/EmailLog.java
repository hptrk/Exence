package com.exence.finance.modules.email.entity;

import com.exence.finance.modules.auth.dto.EmailType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.email.dto.EmailStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = { "user" })
@ToString(callSuper = true, exclude = { "user" })
@Table(name = "email_log")
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "email_log_id_seq")
    @SequenceGenerator(name = "email_log_id_seq", sequenceName = "email_log_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_type", nullable = false)
    private EmailType emailType;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EmailStatus status;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @CreationTimestamp
    @Column(name = "sent_at", nullable = false, updatable = false)
    private Instant sentAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
