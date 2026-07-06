package com.pickleball.backend.modules.court.service.impl;

import com.pickleball.backend.config.PaginationProperties;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.court.dto.request.CreateCourtRequest;
import com.pickleball.backend.modules.court.dto.request.UpdateCourtRequest;
import com.pickleball.backend.modules.court.dto.response.CourtResponse;
import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.court.mapper.CourtMapper;
import com.pickleball.backend.modules.court.repository.CourtRepository;
import com.pickleball.backend.modules.court.service.CourtService;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.repository.UserRepository;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.util.PageableUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class CourtServiceImpl implements CourtService {

    private final CourtRepository courtRepository;
    private final CourtMapper courtMapper;
    private final PaginationProperties paginationProperties;
    private final UserRepository userRepository;

    public CourtServiceImpl(
            CourtRepository courtRepository,
            CourtMapper courtMapper,
            PaginationProperties paginationProperties,
            UserRepository userRepository
    ) {
        this.courtRepository = courtRepository;
        this.courtMapper = courtMapper;
        this.paginationProperties = paginationProperties;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CourtResponse> getCourts(
            Long clubId, String search, 
            java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, 
            java.time.LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime,
            Double userLat, Double userLng, Double radiusInKm,
            String province, String district,
            int page, Integer size, String sortParam) {
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "id");
        if (StringUtils.hasText(sortParam)) {
            String[] parts = sortParam.split(",");
            if (parts.length == 2) {
                org.springframework.data.domain.Sort.Direction dir = "desc".equalsIgnoreCase(parts[1]) ? org.springframework.data.domain.Sort.Direction.DESC : org.springframework.data.domain.Sort.Direction.ASC;
                sort = org.springframework.data.domain.Sort.by(dir, parts[0]);
            }
        }
        Pageable pageable = PageableUtils.createWithSort(page, size, sort, paginationProperties);
        
        Double minLat = null;
        Double maxLat = null;
        Double minLng = null;
        Double maxLng = null;
        
        if (userLat != null && userLng != null && radiusInKm != null && radiusInKm > 0) {
            // 1 degree latitude ~= 111 km
            double latDelta = radiusInKm / 111.0;
            minLat = userLat - latDelta;
            maxLat = userLat + latDelta;
            
            // 1 degree longitude ~= 111 * cos(latitude) km
            double lngDelta = radiusInKm / (111.0 * Math.cos(Math.toRadians(userLat)));
            minLng = userLng - lngDelta;
            maxLng = userLng + lngDelta;
        }

        Page<Court> courtPage = courtRepository.findCourtsWithAdvancedFilters(
                clubId,
                hasSearch(search) ? search.trim() : null,
                minPrice,
                maxPrice,
                minLat, maxLat, minLng, maxLng,
                date, startTime, endTime,
                hasSearch(province) ? province.trim() : null,
                hasSearch(district) ? district.trim() : null,
                pageable
        );

        return PageResponse.from(courtPage.map(courtMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public CourtResponse getCourtById(Long id) {
        Court court = findCourtById(id);
        return courtMapper.toResponse(court);
    }

    @Override
    @Transactional
    public CourtResponse createCourt(String userEmail, CreateCourtRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        if (user.getClub() == null && user.getRole() != com.pickleball.backend.modules.user.entity.UserRole.ROLE_SUPER_ADMIN) {
             throw new com.pickleball.backend.exception.BusinessException("You do not belong to any club to create a court.");
        }

        Court court = courtMapper.toEntity(request);
        // If it's not SUPER_ADMIN, assign to their club
        if (user.getClub() != null) {
            court.setClub(user.getClub());
        }
        
        Court saved = courtRepository.save(court);
        return courtMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CourtResponse updateCourt(String userEmail, Long id, UpdateCourtRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        Court court = findCourtById(id);
        
        if (user.getRole() != com.pickleball.backend.modules.user.entity.UserRole.ROLE_SUPER_ADMIN) {
            if (user.getClub() == null || court.getClub() == null || !user.getClub().getId().equals(court.getClub().getId())) {
                throw new com.pickleball.backend.exception.BusinessException("You do not have permission to update this court.");
            }
        }

        courtMapper.updateEntity(court, request);
        Court updated = courtRepository.save(court);
        return courtMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCourt(Long id) {
        Court court = findCourtById(id);
        courtRepository.delete(court);
    }

    private Court findCourtById(Long id) {
        return courtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));
    }

    private boolean hasSearch(String search) {
        return StringUtils.hasText(search);
    }
}
