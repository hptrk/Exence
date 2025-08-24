package com.exence.finance.common.util;

import com.exence.finance.common.dto.PageResponse;
import lombok.experimental.UtilityClass;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@UtilityClass
public final class ResponseFactory {

    public static <T> ResponseEntity<T> ok(T body) {
        return ResponseEntity.ok(body);
    }

    public static ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    public static <T> ResponseEntity<T> created(Object id, T body) {
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
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
}
