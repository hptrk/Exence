package com.exence.finance.modules.transaction.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionGetDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.RecurringTransaction;
import com.exence.finance.modules.transaction.mapper.RecurringTransactionMapper;
import com.exence.finance.modules.transaction.repository.RecurringTransactionRepository;
import com.exence.finance.modules.transaction.service.RecurringTransactionService;
import java.time.LocalDate;
import java.time.YearMonth;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecurringTransactionServiceImpl implements RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final UserSettingsRepository userSettingsRepository;
    private final RecurringTransactionMapper mapper;

    @ReadTransactional
    public RecurringTransactionGetDTO getById(Long id) {
        RecurringTransaction entity = recurringTransactionRepository
                .find(id)
                .orElseThrow(() -> new ExenceException(ErrorCode.RECURRING_TRANSACTION_NOT_FOUND));
        return mapper.mapToGetDTO(entity);
    }

    @ReadTransactional
    public Page<RecurringTransactionGetDTO> getAll(Pageable pageable, TransactionType type) {
        if (type != null) {
            return recurringTransactionRepository
                    .findAllUserFilteredByType(type, pageable)
                    .map(mapper::mapToGetDTO);
        }
        return recurringTransactionRepository.findAllUserFiltered(pageable).map(mapper::mapToGetDTO);
    }

    @WriteTransactional
    public RecurringTransactionGetDTO create(RecurringTransactionCreateDTO dto) {
        User user = userService.getCurrentUser();
        Category category = categoryRepository
                .find(dto.categoryId())
                .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        SupportedCurrency currency = resolveCurrency(dto.currency(), user);

        RecurringTransaction entity = mapper.mapToEntity(dto);
        entity.setUser(user);
        entity.setCategory(category);
        entity.setCurrency(currency);
        entity.setCurrentOccurrences(0);
        entity.setNextExecutionDate(dto.startDate());
        entity.setActive(true);

        RecurringTransaction saved = recurringTransactionRepository.save(entity);
        return mapper.mapToGetDTO(saved);
    }

    @WriteTransactional
    public RecurringTransactionGetDTO update(Long id, RecurringTransactionPatchDTO dto) {
        RecurringTransaction entity = recurringTransactionRepository
                .find(id)
                .orElseThrow(() -> new ExenceException(ErrorCode.RECURRING_TRANSACTION_NOT_FOUND));

        if (dto.categoryId() != null
                && !dto.categoryId().equals(entity.getCategory().getId())) {
            Category category = categoryRepository
                    .find(dto.categoryId())
                    .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));
            entity.setCategory(category);
        }

        if (dto.currency() != null) {
            entity.setCurrency(dto.currency());
        }

        mapper.updateFromPatchDTO(dto, entity);
        validatePatchedEntity(entity);

        RecurringTransaction saved = recurringTransactionRepository.save(entity);
        return mapper.mapToGetDTO(saved);
    }

    @WriteTransactional
    public void delete(Long id) {
        RecurringTransaction entity = recurringTransactionRepository
                .find(id)
                .orElseThrow(() -> new ExenceException(ErrorCode.RECURRING_TRANSACTION_NOT_FOUND));
        recurringTransactionRepository.delete(entity);
    }

    public static LocalDate calculateNextExecutionDate(RecurringTransaction rt, LocalDate fromDate) {
        return switch (rt.getFrequency()) {
            case WEEKLY -> fromDate.plusWeeks(rt.getInterval());
            case MONTHLY -> {
                YearMonth nextMonth = YearMonth.from(fromDate).plusMonths(rt.getInterval());
                int targetDay = Math.min(rt.getDayOfMonth(), nextMonth.lengthOfMonth());
                yield nextMonth.atDay(targetDay);
            }
            case YEARLY -> fromDate.plusYears(rt.getInterval());
        };
    }

    private SupportedCurrency resolveCurrency(SupportedCurrency currencyFromDTO, User user) {
        if (currencyFromDTO != null) {
            return currencyFromDTO;
        }
        return userSettingsRepository
                .findBaseCurrencyByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("Settings not found for user " + user.getId()));
    }

    private void validatePatchedEntity(RecurringTransaction entity) {
        if (entity.getFrequency() == RecurrenceFrequency.WEEKLY && entity.getDayOfWeek() == null) {
            throw new ExenceException(ErrorCode.VALIDATION_ERROR, "recurring.day-of-week.required");
        }
        if (entity.getFrequency() == RecurrenceFrequency.MONTHLY && entity.getDayOfMonth() == null) {
            throw new ExenceException(ErrorCode.VALIDATION_ERROR, "recurring.day-of-month.required");
        }
        if (entity.getEndCondition() == EndCondition.UNTIL_DATE && entity.getEndDate() == null) {
            throw new ExenceException(ErrorCode.VALIDATION_ERROR, "recurring.end-date.required");
        }
        if (entity.getEndCondition() == EndCondition.AFTER_OCCURRENCES && entity.getMaxOccurrences() == null) {
            throw new ExenceException(ErrorCode.VALIDATION_ERROR, "recurring.max-occurrences.required");
        }
    }
}
