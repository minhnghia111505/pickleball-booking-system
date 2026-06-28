package com.pickleball.backend.modules.club.service.impl;

import com.pickleball.backend.config.PaginationProperties;
import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.club.dto.request.CreateServiceRequest;
import com.pickleball.backend.modules.club.dto.request.UpdateServiceRequest;
import com.pickleball.backend.modules.club.dto.response.ServiceResponse;
import com.pickleball.backend.modules.club.entity.ClubService;
import com.pickleball.backend.modules.club.entity.ServiceStatus;
import com.pickleball.backend.modules.club.mapper.ServiceMapper;
import com.pickleball.backend.modules.club.repository.ClubServiceRepository;
import com.pickleball.backend.modules.club.service.ManagerClubServiceService;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.repository.UserRepository;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.util.PageableUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManagerClubServiceServiceImpl implements ManagerClubServiceService {

    private final ClubServiceRepository clubServiceRepository;
    private final UserRepository userRepository;
    private final PaginationProperties paginationProperties;

    public ManagerClubServiceServiceImpl(
            ClubServiceRepository clubServiceRepository,
            UserRepository userRepository,
            PaginationProperties paginationProperties
    ) {
        this.clubServiceRepository = clubServiceRepository;
        this.userRepository = userRepository;
        this.paginationProperties = paginationProperties;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ServiceResponse> getClubServices(String userEmail, int page, Integer size) {
        User user = findActiveUser(userEmail);
        if (user.getClub() == null) {
            throw new BusinessException("You do not belong to any club.");
        }
        Pageable pageable = PageableUtils.create(page, size, paginationProperties);
        Page<ClubService> servicePage = clubServiceRepository.findByClubId(user.getClub().getId(), pageable);
        return PageResponse.from(servicePage.map(ServiceMapper::toResponse));
    }

    @Override
    @Transactional
    public ServiceResponse createService(String userEmail, CreateServiceRequest request) {
        User user = findActiveUser(userEmail);
        if (user.getClub() == null) {
            throw new BusinessException("You do not belong to any club.");
        }

        ClubService service = new ClubService();
        service.setClub(user.getClub());
        service.setName(request.getName());
        service.setType(request.getType());
        service.setPrice(request.getPrice());
        service.setImageUrl(request.getIcon());
        service.setStatus(ServiceStatus.ACTIVE);

        ClubService saved = clubServiceRepository.save(service);
        return ServiceMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ServiceResponse updateService(String userEmail, Long serviceId, UpdateServiceRequest request) {
        User user = findActiveUser(userEmail);
        ClubService service = clubServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (user.getClub() == null || !user.getClub().getId().equals(service.getClub().getId())) {
            throw new BusinessException("You do not have permission to update this service");
        }

        service.setName(request.getName());
        service.setType(request.getType());
        service.setPrice(request.getPrice());
        service.setImageUrl(request.getIcon());
        service.setStatus(request.getStatus());

        ClubService updated = clubServiceRepository.save(service);
        return ServiceMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteService(String userEmail, Long serviceId) {
        User user = findActiveUser(userEmail);
        ClubService service = clubServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (user.getClub() == null || !user.getClub().getId().equals(service.getClub().getId())) {
            throw new BusinessException("You do not have permission to delete this service");
        }

        clubServiceRepository.delete(service);
    }

    private User findActiveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
