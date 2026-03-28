package com.exence.finance.common.i18n;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Locale;
import lombok.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

@Component
public class UserLocaleResolver extends AcceptHeaderLocaleResolver {

    private static final Locale DEFAULT_LOCALE = Locale.ENGLISH;

    @Override
    public Locale resolveLocale(HttpServletRequest request) {
        String acceptLanguage = request.getHeader("Accept-Language");
        if (acceptLanguage == null || acceptLanguage.trim().isEmpty()) {
            return DEFAULT_LOCALE;
        }

        return super.resolveLocale(request);
    }

    @Override
    public void setLocale(@NonNull HttpServletRequest request, HttpServletResponse response, Locale locale) {
        // since it is a stateless API, locale has to be changed in the DB, not in the session
        throw new UnsupportedOperationException("Change locale via user settings API");
    }
}
