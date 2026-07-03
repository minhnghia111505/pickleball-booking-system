package com.pickleball.backend.modules.club.service;

import com.pickleball.backend.modules.club.dto.request.staff.CreateStaffRequest;
import com.pickleball.backend.modules.club.dto.request.staff.UpdateStaffRequest;
import com.pickleball.backend.modules.club.dto.response.staff.StaffResponse;
import com.pickleball.backend.response.PageResponse;

public interface ManagerStaffService {
    PageResponse<StaffResponse> getStaffs(String managerEmail, int page, Integer size);
    StaffResponse createStaff(String managerEmail, CreateStaffRequest request);
    StaffResponse updateStaff(String managerEmail, Long staffId, UpdateStaffRequest request);
}
