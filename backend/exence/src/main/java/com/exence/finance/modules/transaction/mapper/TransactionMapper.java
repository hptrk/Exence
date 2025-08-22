package com.exence.finance.modules.transaction.mapper;

import com.exence.finance.modules.transaction.dto.TransactionDTO;
import com.exence.finance.modules.transaction.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "categoryId", source = "category.id")
    TransactionDTO mapToTransactionDTO(Transaction transaction);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Transaction mapToTransaction(TransactionDTO transactionDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateTransactionFromDto(TransactionDTO transactionDTO, @MappingTarget Transaction transaction);

    List<TransactionDTO> mapToTransactionDTOList(List<Transaction> transactions);

    List<Transaction> mapToTransactionList(List<TransactionDTO> transactionDTOs);

}
