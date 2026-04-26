package com.exence.finance.modules.transaction.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.RecurringTransactionTestFixtures;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import com.exence.finance.modules.transaction.entity.RecurringTransaction;
import com.exence.finance.modules.transaction.mapper.RecurringTransactionMapper;
import com.exence.finance.modules.transaction.repository.RecurringTransactionRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RecurringTransactionServiceImplTest {

    @Mock
    private RecurringTransactionRepository recurringTransactionRepository;

    @Mock
    private RecurringTransactionMapper recurringTransactionMapper;

    @InjectMocks
    private RecurringTransactionServiceImpl recurringTransactionService;

    @Test
    @DisplayName("returns correct date for weekly recurrence")
    void nextExecution_weekly() {
        // given
        RecurringTransaction rt = RecurringTransactionTestFixtures.weeklyRecurring(1);
        LocalDate from = LocalDate.of(2025, 1, 6); // Monday

        // when
        LocalDate next = RecurringTransactionServiceImpl.calculateNextExecutionDate(rt, from);

        // then
        assertThat(next).isEqualTo(LocalDate.of(2025, 1, 13));
        assertThat(next.getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
    }

    @Test
    @DisplayName("returns correct day of month for monthly recurrence")
    void nextExecution_monthly() {
        // given
        RecurringTransaction rt = RecurringTransactionTestFixtures.monthlyRecurring(1, 15);
        LocalDate from = LocalDate.of(2025, 1, 15);

        // when
        LocalDate next = RecurringTransactionServiceImpl.calculateNextExecutionDate(rt, from);

        // then
        assertThat(next).isEqualTo(LocalDate.of(2025, 2, 15));
    }

    @Test
    @DisplayName("clamps day to last day of month when target month is shorter")
    void nextExecution_monthly_shortMonth() {
        // given
        RecurringTransaction rt = RecurringTransactionTestFixtures.monthlyRecurring(1, 31);
        LocalDate from = LocalDate.of(2025, 1, 31);

        // when
        LocalDate next = RecurringTransactionServiceImpl.calculateNextExecutionDate(rt, from);

        // then
        assertThat(next).isEqualTo(LocalDate.of(2025, 2, 28));
    }

    @Test
    @DisplayName("returns same day next year for yearly recurrence")
    void nextExecution_yearly() {
        // given
        RecurringTransaction rt = RecurringTransactionTestFixtures.yearlyRecurring(1);
        LocalDate from = LocalDate.of(2025, 3, 15);

        // when
        LocalDate next = RecurringTransactionServiceImpl.calculateNextExecutionDate(rt, from);

        // then
        assertThat(next).isEqualTo(LocalDate.of(2026, 3, 15));
    }

    @Test
    @DisplayName("throws VALIDATION_ERROR when weekly recurrence has no day of week")
    void update_weeklyMissingDayOfWeek() {
        // given
        RecurringTransaction entity = RecurringTransactionTestFixtures.weeklyWithoutDayOfWeek(1L, 1);
        var dto = new RecurringTransactionPatchDTO(
                null, null, null, null, null, null, null, null, null, null, null, null, null, null);

        given(recurringTransactionRepository.find(1L)).willReturn(Optional.of(entity));

        // when / then
        assertThatThrownBy(() -> recurringTransactionService.update(1L, dto))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.VALIDATION_ERROR);
    }

    @Test
    @DisplayName("throws VALIDATION_ERROR when UNTIL_DATE condition has no end date")
    void update_untilDateMissingEndDate() {
        // given
        RecurringTransaction entity = RecurringTransactionTestFixtures.monthlyUntilDateWithoutEndDate(1L, 1, 15);
        var dto = new RecurringTransactionPatchDTO(
                null, null, null, null, null, null, null, null, null, null, null, null, null, null);

        given(recurringTransactionRepository.find(1L)).willReturn(Optional.of(entity));

        // when / then
        assertThatThrownBy(() -> recurringTransactionService.update(1L, dto))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.VALIDATION_ERROR);
    }

    @Test
    @DisplayName("throws RECURRING_TRANSACTION_NOT_FOUND when deleting nonexistent")
    void delete_notFound() {
        // given
        given(recurringTransactionRepository.find(99L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> recurringTransactionService.delete(99L))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.RECURRING_TRANSACTION_NOT_FOUND);
    }

    @Test
    @DisplayName("deletes entity from repository")
    void delete_valid() {
        // given
        RecurringTransaction entity = RecurringTransactionTestFixtures.recurringTransactionWithId(1L);
        given(recurringTransactionRepository.find(1L)).willReturn(Optional.of(entity));

        // when
        recurringTransactionService.delete(1L);

        // then
        then(recurringTransactionRepository).should().delete(entity);
    }
}
