package cz.rozek.jan.cinema_town.servicies.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.repositories.SeatRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class SeatService extends CrudService<Seat, SeatRepository> {
    
    @Autowired
    @Override
    public void setRepository(SeatRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "seat-read";
    }
    @Override
    public String createPermissionRequired() {
        return "seat-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "seat-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "seat-delete";
    }
}
