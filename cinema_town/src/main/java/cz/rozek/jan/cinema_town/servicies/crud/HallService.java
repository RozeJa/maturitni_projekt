package cz.rozek.jan.cinema_town.servicies.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Hall;
import cz.rozek.jan.cinema_town.repositories.HallRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class HallService extends CrudService<Hall, HallRepository> {

    @Autowired
    @Override
    public void setRepository(HallRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "hall-read";
    }
    @Override
    public String createPermissionRequired() {
        return "hall-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "hall-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "hall-delete";
    }
}
