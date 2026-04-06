package com.exence.finance.modules.debt.mapper;

import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.entity.Debt;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface DebtMapper {

    int DIVISION_SCALE = 4;
    int PERCENTAGE_MULTIPLIER = 100;

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "paidPercentage", source = "debt", qualifiedByName = "calculatePaidPercentage")
    DebtGetDTO mapToGetDTO(Debt debt);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "remainingAmount", ignore = true)
    @Mapping(target = "originalBaseCurrencyAmount", ignore = true)
    @Mapping(target = "remainingBaseCurrencyAmount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Debt mapFromCreateDTO(DebtCreateDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "currency", ignore = true)
    @Mapping(target = "originalAmount", ignore = true)
    @Mapping(target = "remainingAmount", ignore = true)
    @Mapping(target = "originalBaseCurrencyAmount", ignore = true)
    @Mapping(target = "remainingBaseCurrencyAmount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateDebtFromPatchDTO(DebtPatchDTO dto, @MappingTarget Debt debt);

    @Named("calculatePaidPercentage")
    default BigDecimal calcPaidPercentage(Debt debt) {
        if (debt.getOriginalAmount() == null
                || debt.getOriginalAmount().compareTo(BigDecimal.ZERO) <= 0
                || debt.getRemainingAmount() == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal paid = debt.getOriginalAmount().subtract(debt.getRemainingAmount());
        BigDecimal percentage = paid.divide(debt.getOriginalAmount(), DIVISION_SCALE, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER))
                .setScale(2, RoundingMode.HALF_UP);
        return percentage.max(BigDecimal.ZERO).min(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER));
    }
}
