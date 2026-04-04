package com.exence.finance.modules.auth.mapper;

import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.entity.User;
import java.time.Instant;
import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Mapping(target = "isVerified", source = "emailVerified")
    @Mapping(target = "username", source = "displayUsername")
    public abstract UserGetDTO mapToUserGetDto(User user);

    @Mapping(target = "password", ignore = true) // aftermapping
    @Mapping(target = "emailVerified", ignore = true) // aftermapping
    @Mapping(target = "lastLoginAt", ignore = true) // aftermapping
    @Mapping(target = "createdAt", ignore = true) // AfterMapping
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "tokens", ignore = true)
    @Mapping(target = "emailLogs", ignore = true)
    @Mapping(target = "passwordHistories", ignore = true)
    @Mapping(target = "settings", ignore = true)
    public abstract User mapRegisterRequestToUser(RegisterRequest registerRequest);

    @AfterMapping
    protected void finalizeRegistration(RegisterRequest request, @MappingTarget User user) {
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmailVerified(false);
        user.setLastLoginAt(Instant.now());
        user.setCreatedAt(Instant.now());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "tokens", ignore = true)
    @Mapping(target = "emailLogs", ignore = true)
    @Mapping(target = "passwordHistories", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "settings", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void updateUserFromPatchDto(UserPatchDTO userPatchDTO, @MappingTarget User user);
}
