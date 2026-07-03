package com.pickleball.backend.modules.club.service.impl;

import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.modules.club.dto.request.settings.UpdateClubSettingsRequest;
import com.pickleball.backend.modules.club.dto.response.ClubResponse;
import com.pickleball.backend.modules.club.entity.Club;
import com.pickleball.backend.modules.club.mapper.ClubMapper;
import com.pickleball.backend.modules.club.repository.ClubRepository;
import com.pickleball.backend.modules.club.service.ManagerClubSettingsService;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManagerClubSettingsServiceImpl implements ManagerClubSettingsService {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;


    public ManagerClubSettingsServiceImpl(
            UserRepository userRepository,
            ClubRepository clubRepository
    ) {
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ClubResponse getClubSettings(String managerEmail) {
        User manager = getManager(managerEmail);
        return ClubMapper.toResponse(manager.getClub());
    }

    @Override
    @Transactional
    public ClubResponse updateClubSettings(String managerEmail, UpdateClubSettingsRequest request) {
        User manager = getManager(managerEmail);
        Club club = manager.getClub();

        club.setName(request.getName());
        club.setAddress(request.getAddress());
        club.setPhone(request.getPhone());
        club.setEmail(request.getEmail());
        club.setDescription(request.getDescription());
        club.setLogoUrl(request.getLogoUrl());
        club.setOpenTime(request.getOpenTime());
        club.setCloseTime(request.getCloseTime());

        Club updatedClub = clubRepository.save(club);
        return ClubMapper.toResponse(updatedClub);
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
