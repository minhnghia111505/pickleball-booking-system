package com.pickleball.backend.modules.auth.controller;

import com.pickleball.backend.modules.auth.dto.JwtResponse;
import com.pickleball.backend.modules.auth.dto.LoginRequest;
import com.pickleball.backend.modules.auth.dto.SignupRequest;
import com.pickleball.backend.modules.user.entity.User;
import com.pickleball.backend.modules.user.entity.UserRole;
import com.pickleball.backend.modules.user.entity.UserStatus;
import com.pickleball.backend.modules.user.repository.UserRepository;
import com.pickleball.backend.response.ApiResponse;
import com.pickleball.backend.security.jwt.JwtService;
import com.pickleball.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder encoder, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        // Generate JWT using the new JwtService
        String jwt = jwtService.generateAccessToken(userDetails.getEmail(), role);

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        String fullName = user != null ? user.getFullName() : "";

        return ResponseEntity.ok(ApiResponse.success("Login successful",
                new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(), fullName, role, userDetails.getClubId())));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error: Email is already in use!"));
        }

        User user = User.builder()
                .email(signUpRequest.getEmail())
                .fullName(signUpRequest.getFullName())
                .phone(signUpRequest.getPhone())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("User registered successfully!", null));
    }
}
