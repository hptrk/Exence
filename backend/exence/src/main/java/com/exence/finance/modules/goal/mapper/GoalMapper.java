package com.exence.finance.modules.goal.mapper;

import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.entity.Goal;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface GoalMapper {

    int DIVISION_SCALE = 4;
    int PERCENTAGE_MULTIPLIER = 100;

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "progressPercentage", source = "goal", qualifiedByName = "calculateProgressPercentage")
    GoalGetDTO mapToGetDTO(Goal goal);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "currentAmount", ignore = true)
    @Mapping(target = "currentBaseCurrencyAmount", ignore = true)
    @Mapping(target = "targetBaseCurrencyAmount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Goal mapFromCreateDTO(GoalCreateDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "currentAmount", ignore = true)
    @Mapping(target = "targetAmount", ignore = true)
    @Mapping(target = "currency", ignore = true)
    @Mapping(target = "currentBaseCurrencyAmount", ignore = true)
    @Mapping(target = "targetBaseCurrencyAmount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateGoalFromPatchDTO(GoalPatchDTO dto, @MappingTarget Goal goal);

    @Named("calculateProgressPercentage")
    default BigDecimal calcProgressPercentage(Goal goal) {
        if (goal.getCurrentAmount() == null
                || goal.getTargetAmount() == null
                || goal.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal percentage = goal.getCurrentAmount()
                .divide(goal.getTargetAmount(), DIVISION_SCALE, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER))
                .setScale(2, RoundingMode.HALF_UP);
        return percentage.min(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER));
    }
}
