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

    public CourtServiceImpl(
            CourtRepository courtRepository,
            CourtMapper courtMapper,
            PaginationProperties paginationProperties
    ) {
        this.courtRepository = courtRepository;
        this.courtMapper = courtMapper;
        this.paginationProperties = paginationProperties;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CourtResponse> getCourts(String search, int page, Integer size) {
        Pageable pageable = PageableUtils.create(page, size, paginationProperties);
        Page<Court> courtPage = hasSearch(search)
                ? courtRepository.findByNameContainingIgnoreCase(search.trim(), pageable)
                : courtRepository.findAll(pageable);

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
    public CourtResponse createCourt(CreateCourtRequest request) {
        Court court = courtMapper.toEntity(request);
        Court saved = courtRepository.save(court);
        return courtMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CourtResponse updateCourt(Long id, UpdateCourtRequest request) {
        Court court = findCourtById(id);
        courtMapper.updateEntity(court, request);
        Court saved = courtRepository.save(court);
        return courtMapper.toResponse(saved);
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
