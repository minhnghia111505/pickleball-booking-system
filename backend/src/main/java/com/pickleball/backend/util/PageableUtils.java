package com.pickleball.backend.util;

import com.pickleball.backend.config.PaginationProperties;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PageableUtils {

    private PageableUtils() {
    }

    public static Pageable create(int page, Integer size, PaginationProperties paginationProperties) {
        int normalizedPage = Math.max(page, 0);
        int pageSize = resolvePageSize(size, paginationProperties);
        return PageRequest.of(normalizedPage, pageSize, Sort.by(Sort.Direction.ASC, "id"));
    }

    public static Pageable createWithSort(int page, Integer size, Sort sort, PaginationProperties paginationProperties) {
        int normalizedPage = Math.max(page, 0);
        int pageSize = resolvePageSize(size, paginationProperties);
        return PageRequest.of(normalizedPage, pageSize, sort);
    }

    private static int resolvePageSize(Integer size, PaginationProperties paginationProperties) {
        if (size == null) {
            return paginationProperties.defaultPageSize();
        }
        if (size < 1) {
            return paginationProperties.defaultPageSize();
        }
        return Math.min(size, paginationProperties.maxPageSize());
    }
}
