package com.exence.finance.modules.auth.dto.response;

import com.exence.finance.modules.auth.dto.UserDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import java.io.Serializable;
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
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true, exclude = "tokens")
public class AuthenticationResponse implements Serializable {
    @Valid
    private UserDTO user;

    // internal use only - not serialized to JSON, used for setting cookies in controller
    @JsonIgnore
    private TokenPair tokens;
}
