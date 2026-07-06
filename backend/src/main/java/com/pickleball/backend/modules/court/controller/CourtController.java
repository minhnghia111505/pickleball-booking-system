package com.pickleball.backend.modules.court.controller;

import com.pickleball.backend.modules.court.dto.request.CreateCourtRequest;
import com.pickleball.backend.modules.court.dto.request.UpdateCourtRequest;
import com.pickleball.backend.modules.court.dto.response.CourtResponse;
import com.pickleball.backend.modules.court.service.CourtService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.security.SecurityRoles;
import com.pickleball.backend.security.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/courts")
public class CourtController {

    private final CourtService courtService;

    public CourtController(CourtService courtService) {
        this.courtService = courtService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CourtResponse>>> getCourts(
            @RequestParam(required = false) Long clubId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.TIME) java.time.LocalTime startTime,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.TIME) java.time.LocalTime endTime,
            @RequestParam(required = false) Double userLat,
            @RequestParam(required = false) Double userLng,
            @RequestParam(required = false) Double radiusInKm,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String district,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort
    ) {
        PageResponse<CourtResponse> courts = courtService.getCourts(
                clubId, search, minPrice, maxPrice, 
                date, startTime, endTime, 
                userLat, userLng, radiusInKm, 
                province, district,
                page, size, sort
        );
        return ResponseEntity.ok(ApiResponse.success("Courts retrieved successfully", courts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourtResponse>> getCourtById(@PathVariable Long id) {
        CourtResponse court = courtService.getCourtById(id);
        return ResponseEntity.ok(ApiResponse.success("Court retrieved successfully", court));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('" + SecurityRoles.ADMIN + "', '" + SecurityRoles.MANAGER + "')")
    public ResponseEntity<ApiResponse<CourtResponse>> createCourt(
            @Valid @RequestBody CreateCourtRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        CourtResponse court = courtService.createCourt(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Court created successfully", court));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.ADMIN + "', '" + SecurityRoles.MANAGER + "')")
    public ResponseEntity<ApiResponse<CourtResponse>> updateCourt(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCourtRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        CourtResponse court = courtService.updateCourt(email, id, request);
        return ResponseEntity.ok(ApiResponse.success("Court updated successfully", court));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('" + SecurityRoles.ADMIN + "', '" + SecurityRoles.MANAGER + "')")
    public ResponseEntity<ApiResponse<Void>> deleteCourt(@PathVariable Long id) {
        courtService.deleteCourt(id);
        return ResponseEntity.ok(ApiResponse.success("Court deleted successfully", null));
    }
}
