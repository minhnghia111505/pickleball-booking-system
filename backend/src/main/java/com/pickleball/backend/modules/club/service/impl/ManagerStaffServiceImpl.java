package com.pickleball.backend.modules.club.service.impl;

import com.pickleball.backend.config.PaginationProperties;
import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.club.dto.request.staff.CreateStaffRequest;
import com.pickleball.backend.modules.club.dto.request.staff.UpdateStaffRequest;
import com.pickleball.backend.modules.club.dto.response.staff.StaffResponse;
import com.pickleball.backend.modules.club.mapper.ManagerStaffMapper;
import com.pickleball.backend.modules.club.service.ManagerStaffService;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.entity.UserRole;
import com.pickleball.backend.modules.user.entity.UserStatus;
import com.pickleball.backend.modules.user.repository.UserRepository;
import com.pickleball.backend.response.PageResponse;
import com.pickleball.backend.util.PageableUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManagerStaffServiceImpl implements ManagerStaffService {

    private final UserRepository userRepository;
    private final ManagerStaffMapper managerStaffMapper;
    private final PaginationProperties paginationProperties;
    private final PasswordEncoder passwordEncoder;

    public ManagerStaffServiceImpl(
            UserRepository userRepository,
            ManagerStaffMapper managerStaffMapper,
            PaginationProperties paginationProperties,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.managerStaffMapper = managerStaffMapper;
        this.paginationProperties = paginationProperties;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<StaffResponse> getStaffs(String managerEmail, int page, Integer size) {
        User manager = getManager(managerEmail);
        Pageable pageable = PageableUtils.create(page, size, paginationProperties);
        Page<User> staffPage = userRepository.findByClubIdAndRole(manager.getClub().getId(), UserRole.ROLE_STAFF, pageable);
        return PageResponse.from(staffPage.map(managerStaffMapper::toResponse));
    }

    @Override
    @Transactional
    public StaffResponse createStaff(String managerEmail, CreateStaffRequest request) {
        User manager = getManager(managerEmail);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }

        User staff = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .password(passwordEncoder.encode("123456")) // Default password
                .role(UserRole.ROLE_STAFF)
                .status(UserStatus.ACTIVE)
                .club(manager.getClub())
                .build();

        User savedStaff = userRepository.save(staff);
        return managerStaffMapper.toResponse(savedStaff);
    }

    @Override
    @Transactional
    public StaffResponse updateStaff(String managerEmail, Long staffId, UpdateStaffRequest request) {
        User manager = getManager(managerEmail);

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));

        if (!staff.getRole().equals(UserRole.ROLE_STAFF) || 
            staff.getClub() == null || 
            !staff.getClub().getId().equals(manager.getClub().getId())) {
            throw new BusinessException("You don't have permission to modify this staff");
        }

        staff.setFullName(request.getFullName());
        staff.setPhone(request.getPhone());
        staff.setStatus(request.getStatus());

        User updatedStaff = userRepository.save(staff);
        return managerStaffMapper.toResponse(updatedStaff);
    }

    private User getManager(String email) {
        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        if (manager.getClub() == null) {
            throw new BusinessException("Manager is not associated with any club");
        }
        return manager;
    }
}
