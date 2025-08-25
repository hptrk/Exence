package com.exence.finance.modules.auth.dto;

import com.exence.finance.common.annotations.ValidStrictEmail;
import com.exence.finance.common.annotations.ValidUsername;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false, exclude = { "" })
@ToString(callSuper = true, exclude = { "" })
@JsonIdentityInfo(generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = UserDTO.class)
public class UserDTO {
    private Long id;

    @ValidUsername
    private String username;

    @ValidStrictEmail
    private String email;
}
