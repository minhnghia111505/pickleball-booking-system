package com.pickleball.backend.modules.club.service.impl;

import com.pickleball.backend.config.PaginationProperties;
import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.club.service.ManagerScheduleService;
import com.pickleball.backend.modules.court.entity.Court;
import com.pickleball.backend.modules.court.repository.CourtRepository;
import com.pickleball.backend.modules.schedule.dto.request.CreateScheduleLockRequest;
import com.pickleball.backend.modules.schedule.dto.response.ScheduleLockResponse;
import com.pickleball.backend.modules.schedule.entity.ScheduleLock;
import com.pickleball.backend.modules.schedule.mapper.ScheduleLockMapper;
import com.pickleball.backend.modules.schedule.repository.ScheduleLockRepository;
import com.pickleball.backend.modules.schedule.service.ScheduleService;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.repository.UserRepository;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.util.PageableUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManagerScheduleServiceImpl implements ManagerScheduleService {

    private final ScheduleService scheduleService;
    private final ScheduleLockRepository scheduleLockRepository;
    private final ScheduleLockMapper scheduleLockMapper;
    private final UserRepository userRepository;
    private final CourtRepository courtRepository;
    private final PaginationProperties paginationProperties;

    public ManagerScheduleServiceImpl(
            ScheduleService scheduleService,
            ScheduleLockRepository scheduleLockRepository,
            ScheduleLockMapper scheduleLockMapper,
            UserRepository userRepository,
            CourtRepository courtRepository,
            PaginationProperties paginationProperties
    ) {
        this.scheduleService = scheduleService;
        this.scheduleLockRepository = scheduleLockRepository;
        this.scheduleLockMapper = scheduleLockMapper;
        this.userRepository = userRepository;
        this.courtRepository = courtRepository;
        this.paginationProperties = paginationProperties;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ScheduleLockResponse> getScheduleLocks(String managerEmail, Long courtId, int page, Integer size) {
        User manager = getManager(managerEmail);
        Court court = getCourtAndVerifyOwnership(courtId, manager);
        
        Pageable pageable = PageableUtils.create(page, size, paginationProperties);
        Page<ScheduleLock> lockPage = scheduleLockRepository.findByCourtId(courtId, pageable);
        
        return PageResponse.from(lockPage.map(lock -> scheduleLockMapper.toResponse(lock, court)));
    }

    @Override
    @Transactional
    public ScheduleLockResponse createScheduleLock(String managerEmail, CreateScheduleLockRequest request) {
        User manager = getManager(managerEmail);
        getCourtAndVerifyOwnership(request.getCourtId(), manager);
        
        // Use the existing schedule service to create the lock
        return scheduleService.createMaintenanceLock(request);
    }

    @Override
    @Transactional
    public void deleteScheduleLock(String managerEmail, Long lockId) {
        User manager = getManager(managerEmail);
        
        ScheduleLock lock = scheduleLockRepository.findById(lockId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule lock not found"));
                
        getCourtAndVerifyOwnership(lock.getCourt().getId(), manager);
        
        scheduleService.deleteMaintenanceLock(lockId);
    }

    private User getManager(String email) {
        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        if (manager.getClub() == null) {
            throw new BusinessException("Manager is not associated with any club");
        }
        return manager;
    }

    private Court getCourtAndVerifyOwnership(Long courtId, User manager) {
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));
        if (court.getClub() == null || !court.getClub().getId().equals(manager.getClub().getId())) {
            throw new BusinessException("You don't have permission to modify this court's schedule");
        }
        return court;
    }
}
