package com.exence.finance.config;

import com.exence.finance.security.CustomAuthenticationProvider;
import com.exence.finance.security.JwtAuthenticationFilter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomAuthenticationProvider customAuthenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable) // REST stateless API, no need for CSRF
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/auth/**").permitAll() // allow all requests to /auth (registration, login))
                        .anyRequest().authenticated()) // all other requests need to be authenticated
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // no session management
                .authenticationProvider(customAuthenticationProvider) // custom authentication provider
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // add JWT filter before UsernamePasswordAuthenticationFilter
                .logout(logout -> logout.logoutUrl("/auth/logout").addLogoutHandler(logoutHandler).logoutSuccessHandler((request, response, authentication) ->
        SecurityContextHolder.clearContext())); // clear security context on logout

        return http.build();
    }
}
