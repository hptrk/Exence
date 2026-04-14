package com.exence.finance.config;

import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import java.util.Map;
import org.javers.spring.auditable.AuthorProvider;
import org.javers.spring.auditable.CommitPropertiesProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class JaversConfig {

    @Bean
    public AuthorProvider authorProvider() {
        return () -> {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
                return auth.getName();
            }
            return "SYSTEM";
        };
    }

    @Bean
    public CommitPropertiesProvider commitPropertiesProvider() {
        return new CommitPropertiesProvider() {
            @Override
            public Map<String, String> provideForCommittedObject(Object domainObject) {
                if (WorkspaceContextHolder.isSet()) {
                    return Map.of(
                            "workspaceId",
                            WorkspaceContextHolder.getWorkspaceId().toString());
                }
                return Map.of();
            }
        };
    }
}
