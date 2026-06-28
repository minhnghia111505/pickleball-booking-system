package com.pickleball.backend.modules.club.service;

import com.pickleball.backend.modules.club.dto.request.CreateServiceRequest;
import com.pickleball.backend.modules.club.dto.request.UpdateServiceRequest;
import com.pickleball.backend.modules.club.dto.response.ServiceResponse;
import com.pickleball.backend.response.PageResponse;

public interface ManagerClubServiceService {
    PageResponse<ServiceResponse> getClubServices(String userEmail, int page, Integer size);
    ServiceResponse createService(String userEmail, CreateServiceRequest request);
    ServiceResponse updateService(String userEmail, Long serviceId, UpdateServiceRequest request);
    void deleteService(String userEmail, Long serviceId);
}
