package com.pickleball.backend.modules.club.service.impl;

import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.club.dto.response.ClubResponse;
import com.pickleball.backend.modules.club.dto.response.ServiceResponse;
import com.pickleball.backend.modules.club.entity.Club;
import com.pickleball.backend.modules.club.entity.ServiceStatus;
import com.pickleball.backend.modules.club.mapper.ClubMapper;
import com.pickleball.backend.modules.club.mapper.ServiceMapper;
import com.pickleball.backend.modules.club.repository.ClubRepository;
import com.pickleball.backend.modules.club.repository.ClubServiceRepository;
import com.pickleball.backend.modules.club.service.ClubApiService;
import com.pickleball.backend.response.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClubApiServiceImpl implements ClubApiService {

    private final ClubRepository clubRepository;
    private final ClubServiceRepository clubServiceRepository;

    public ClubApiServiceImpl(ClubRepository clubRepository, ClubServiceRepository clubServiceRepository) {
        this.clubRepository = clubRepository;
        this.clubServiceRepository = clubServiceRepository;
    }

    @Override
    public PageResponse<ClubResponse> getClubs(String search, int page, Integer size) {
        int pageSize = (size != null && size > 0) ? size : 10;
        Pageable pageable = PageRequest.of(page, pageSize);
        
        Page<Club> clubPage;
        if (search != null && !search.trim().isEmpty()) {
            clubPage = clubRepository.findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(search, search, pageable);
        } else {
            clubPage = clubRepository.findAll(pageable);
        }

        List<ClubResponse> content = clubPage.getContent().stream()
                .map(ClubMapper::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<ClubResponse>builder()
                .content(content)
                .page(clubPage.getNumber())
                .size(clubPage.getSize())
                .totalElements(clubPage.getTotalElements())
                .totalPages(clubPage.getTotalPages())
                .last(clubPage.isLast())
                .build();
    }

    @Override
    public ClubResponse getClubById(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + id));
        return ClubMapper.toResponse(club);
    }

    @Override
    public List<ServiceResponse> getServicesByClubId(Long clubId) {
        // Only return ACTIVE services
        return clubServiceRepository.findByClubIdAndStatus(clubId, ServiceStatus.ACTIVE)
                .stream()
                .map(ServiceMapper::toResponse)
                .collect(Collectors.toList());
    }
}
