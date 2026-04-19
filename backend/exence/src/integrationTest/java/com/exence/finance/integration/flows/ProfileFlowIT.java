package com.exence.finance.integration.flows;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import com.exence.finance.integration.data.ITFixtures;
import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.integration.setup.BaseFlowIT;
import com.exence.finance.modules.auth.dto.Theme;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import org.junit.jupiter.api.Test;

/**
 * Integration flows: Group 3 — User Profile & Settings
 *
 * <p>FLOW-PROFILE-01: Managing profile and user settings
 */
class ProfileFlowIT extends BaseFlowIT {

    @Test
    void flowProfile01_manageProfileAndSettings() {
        // 1. Register and verify
        AuthContext user = authActor().registerVerifiedUser();

        // 2. GET /user → verify username, email, role
        var profile = userActor().getUser(user);
        assertThat(profile.username()).isNotBlank();
        assertThat(profile.email()).isNotBlank();
        assertThat(profile.role()).isNotNull();

        // 3. PATCH /user with new username → 200, response has new username
        var updated = userActor().patchUser(user, ITFixtures.userPatch().username("NewCoolName").build());
        assertThat(updated.username()).isEqualTo("NewCoolName");

        // 4. GET /user → new username is reflected
        assertThat(userActor().getUser(user).username()).isEqualTo("NewCoolName");

        // 5. GET /user/settings → language, themes, baseCurrency, showBaseCurrency present
        UserSettingsResponse settings = userSettingsActor().getSettings(user);
        assertThat(settings).isNotNull();

        // 6. PATCH /user/settings updating language + primaryTheme → 200, new values
        UpdateUserSettingsRequest patch = new UpdateUserSettingsRequest(
                "en", Theme.DARK, null, null, null);
        UserSettingsResponse patched = userSettingsActor().patchSettings(user, patch);
        assertThat(patched.language()).isEqualTo("en");
        assertThat(patched.primaryTheme()).isEqualTo(Theme.DARK);

        // 7. GET /user/settings → updated values visible, other fields unchanged
        UserSettingsResponse reloaded = userSettingsActor().getSettings(user);
        assertThat(reloaded.language()).isEqualTo("en");
        assertThat(reloaded.primaryTheme()).isEqualTo("DARK");
        assertThat(reloaded.baseCurrency()).isEqualTo(settings.baseCurrency());

        // 8. PATCH /user/settings with invalid language code → 400 VALIDATION_ERROR
        UpdateUserSettingsRequest invalid = new UpdateUserSettingsRequest(
                "INVALID_LANG_CODE_99", null, null, null, null);
        userSettingsActor().patchSettingsRaw(user, invalid)
                .statusCode(400)
                .body("code", equalTo("validation-error"));
    }
}
