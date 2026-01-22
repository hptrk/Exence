package com.exence.finance.common.util;

import com.exence.finance.common.dto.PageResponse;
import java.net.URI;
import lombok.experimental.UtilityClass;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@UtilityClass
public final class ResponseFactory {

    public static <T> ResponseEntity<T> ok(T body) {
        return ResponseEntity.ok(body);
    }

    public static ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    public static <T> ResponseEntity<T> created(Object id, T body) {
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).body(body);
    }

    public static <T> ResponseEntity<T> createdAt(URI location, T body) {
        return ResponseEntity.created(location).body(body);
    }

    public static <T> ResponseEntity<PageResponse<T>> page(Page<T> page) {
        return ResponseEntity.ok(PageResponse.from(page));
    }

    public static <T> ResponseEntity<T> okWithCookies(T body, ResponseCookie... cookies) {
        var builder = ResponseEntity.ok();
        for (ResponseCookie cookie : cookies) {
            builder.header(HttpHeaders.SET_COOKIE, cookie.toString());
        }
        return builder.body(body);
    }

    public static ResponseEntity<Void> noContentWithCookies(ResponseCookie... cookies) {
        var builder = ResponseEntity.noContent();
        for (ResponseCookie cookie : cookies) {
            builder.header(HttpHeaders.SET_COOKIE, cookie.toString());
        }
        return builder.build();
    }
}
