package com.pickleball.backend.modules.club.controller;

import com.pickleball.backend.modules.club.dto.response.ClubResponse;
import com.pickleball.backend.modules.club.dto.response.ServiceResponse;
import com.pickleball.backend.modules.club.service.ClubApiService;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.response.PageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/clubs")
public class ClubController {

    private final ClubApiService clubApiService;

    public ClubController(ClubApiService clubApiService) {
        this.clubApiService = clubApiService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ClubResponse>>> getClubs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size
    ) {
        PageResponse<ClubResponse> clubs = clubApiService.getClubs(search, page, size);
        return ResponseEntity.ok(ApiResponse.success("Clubs retrieved successfully", clubs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClubResponse>> getClubById(@PathVariable Long id) {
        ClubResponse club = clubApiService.getClubById(id);
        return ResponseEntity.ok(ApiResponse.success("Club retrieved successfully", club));
    }

    @GetMapping("/{id}/services")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getServicesByClubId(@PathVariable Long id) {
        List<ServiceResponse> services = clubApiService.getServicesByClubId(id);
        return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
    }
}
