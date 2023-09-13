package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.repositories.ReservationRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class ReservationService extends CrudService<Reservation, ReservationRepository> {
    
    @Autowired
    @Override
    public void setRepository(ReservationRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "reservation-read";
    }
    @Override
    public String createPermissionRequired() {
        return "reservation-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "reservation-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "reservation-delete";
    }
}
