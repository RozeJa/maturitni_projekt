package cz.rozek.jan.cinema_town.servicies.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Role;
import cz.rozek.jan.cinema_town.repositories.RoleRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class RoleService extends CrudService<Role, RoleRepository> {
    
    @Autowired
    @Override
    public void setRepository(RoleRepository repository) {
        this.repository = repository;
    }
    @Autowired 
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "role-read";
    }
    @Override
    public String createPermissionRequired() {
        return "role-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "role-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "role-delete";
    }
}