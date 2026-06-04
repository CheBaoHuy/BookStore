package com.bookstore.service;

import com.bookstore.dto.AddressDto;
import com.bookstore.model.Address;
import com.bookstore.model.User;
import com.bookstore.repository.AddressRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Address> getAddressesByUser(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Transactional
    public Address createAddress(Long userId, AddressDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        // Nếu đây là địa chỉ mặc định, bỏ mặc định của các địa chỉ khác
        if (dto.isDefault()) {
            List<Address> existing = addressRepository.findByUserId(userId);
            existing.forEach(a -> {
                a.setDefault(false);
                addressRepository.save(a);
            });
        }

        Address address = Address.builder()
                .user(user)
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .street(dto.getStreet())
                .wardId(dto.getWardId())
                .ward(dto.getWard())
                .districtId(dto.getDistrictId())
                .district(dto.getDistrict())
                .provinceId(dto.getProvinceId())
                .province(dto.getProvince())
                .isDefault(dto.isDefault())
                .build();

        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(Long addressId, Long userId, AddressDto dto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ!"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền sửa địa chỉ này!");
        }

        if (dto.isDefault()) {
            List<Address> existing = addressRepository.findByUserId(userId);
            existing.forEach(a -> {
                a.setDefault(false);
                addressRepository.save(a);
            });
        }

        address.setFullName(dto.getFullName());
        address.setPhone(dto.getPhone());
        address.setStreet(dto.getStreet());
        address.setWardId(dto.getWardId());
        address.setWard(dto.getWard());
        address.setDistrictId(dto.getDistrictId());
        address.setDistrict(dto.getDistrict());
        address.setProvinceId(dto.getProvinceId());
        address.setProvince(dto.getProvince());
        address.setDefault(dto.isDefault());

        return addressRepository.save(address);
    }

    public void deleteAddress(Long addressId, Long userId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ!"));
        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa địa chỉ này!");
        }
        addressRepository.delete(address);
    }
}
