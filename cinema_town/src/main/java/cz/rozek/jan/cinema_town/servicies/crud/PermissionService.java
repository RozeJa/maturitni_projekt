package cz.rozek.jan.cinema_town.servicies.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Permission;
import cz.rozek.jan.cinema_town.repositories.PermissionRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class PermissionService extends CrudService<Permission, PermissionRepository> {
    
    @Autowired
    @Override
    public void setRepository(PermissionRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "permission-read";
    }
    @Override
    public String createPermissionRequired() {
        return "permission-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "permission-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "permission-delete";
    }
}
