package cz.rozek.jan.cinema_town.servicies.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.repositories.ProjectionRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class ProjectionService extends CrudService<Projection, ProjectionRepository> {
    
    @Autowired
    @Override
    public void setRepository(ProjectionRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }
 
    @Override
    public String readPermissionRequired() {
        return "projection-read";
    }
    @Override
    public String createPermissionRequired() {
        return "projection-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "projection-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "projection-delete";
    }
}