package com.pickleball.backend.modules.user.service.impl;

import com.pickleball.backend.exception.BusinessException;
import com.pickleball.backend.exception.ResourceNotFoundException;
import com.pickleball.backend.exception.UnauthorizedException;
import com.pickleball.backend.modules.user.dto.request.ChangePasswordRequest;
import com.pickleball.backend.modules.user.dto.request.UpdateProfileRequest;
import com.pickleball.backend.modules.user.dto.response.UserProfileResponse;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.entity.UserStatus;
import com.pickleball.backend.modules.user.mapper.UserMapper;
import com.pickleball.backend.modules.user.repository.UserRepository;
import com.pickleball.backend.modules.user.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        User user = findActiveUserByEmail(email);
        return userMapper.toProfileResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findActiveUserByEmail(email);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        User saved = userRepository.save(user);
        return userMapper.toProfileResponse(saved);
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("New password and confirm password do not match");
        }

        User user = findActiveUserByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BusinessException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findActiveUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException("Account is inactive");
        }

        return user;
    }
}
