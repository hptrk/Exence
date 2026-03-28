package com.exence.finance.modules.auth.mapper;

import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.dto.request.UpdateUserRequest;
import com.exence.finance.modules.auth.entity.User;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "isVerified", source = "emailVerified")
    @Mapping(target = "username", source = "displayUsername")
    UserDTO mapToUserDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "tokens", ignore = true)
    @Mapping(target = "settings", ignore = true)
    User mapToUser(UserDTO userDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "tokens", ignore = true)
    @Mapping(target = "settings", ignore = true)
    void updateUserFromDto(UserDTO userDTO, @MappingTarget User user);

    List<UserDTO> mapToUserDtoList(List<User> users);

    List<User> mapToUserList(List<UserDTO> userDTOs);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "settings", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UpdateUserRequest request, @MappingTarget User user);
}
