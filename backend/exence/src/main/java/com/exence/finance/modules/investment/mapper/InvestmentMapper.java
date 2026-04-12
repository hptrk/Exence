package com.exence.finance.modules.investment.mapper;

import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.investment.entity.Investment;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface InvestmentMapper {

    InvestmentGetDTO mapToGetDTO(Investment investment);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    @Mapping(target = "baseCurrencyAmount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Investment mapFromCreateDTO(InvestmentCreateDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workspace", ignore = true)
    @Mapping(target = "currency", ignore = true)
    @Mapping(target = "baseCurrencyAmount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateInvestmentFromPatchDTO(InvestmentPatchDTO dto, @MappingTarget Investment investment);
}
