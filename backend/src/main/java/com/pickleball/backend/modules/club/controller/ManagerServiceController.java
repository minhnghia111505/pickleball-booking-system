package com.pickleball.backend.modules.club.controller;

import com.pickleball.backend.modules.club.dto.request.CreateServiceRequest;
import com.pickleball.backend.modules.club.dto.request.UpdateServiceRequest;
import com.pickleball.backend.modules.club.dto.response.ServiceResponse;
import com.pickleball.backend.modules.club.service.ManagerClubServiceService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.security.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manager/services")
@PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
public class ManagerServiceController {

    private final ManagerClubServiceService managerClubServiceService;

    public ManagerServiceController(ManagerClubServiceService managerClubServiceService) {
        this.managerClubServiceService = managerClubServiceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ServiceResponse>>> getServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        PageResponse<ServiceResponse> response = managerClubServiceService.getClubServices(email, page, size);
        return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceResponse>> createService(
            @Valid @RequestBody CreateServiceRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        ServiceResponse response = managerClubServiceService.createService(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody UpdateServiceRequest request
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        ServiceResponse response = managerClubServiceService.updateService(email, id, request);
        return ResponseEntity.ok(ApiResponse.success("Service updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        String email = SecurityUtils.getCurrentUserEmail();
        managerClubServiceService.deleteService(email, id);
        return ResponseEntity.ok(ApiResponse.success("Service deleted successfully", null));
    }
}
