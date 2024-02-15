package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.ReservationRepository;
import cz.rozek.jan.cinema_town.repositories.SeatRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class SeatService extends CrudService<Seat, SeatRepository> {
    
    private ReservationRepository reservationRepository;

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
    @Autowired
    public void setReservationRepository(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
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
    
    @Override
    public User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException, AuthRequired {
        
        if (requiredPermission.equals(readPermissionRequired())) {
            return null;
        } 

        return super.verifyAccess(accessJWT, requiredPermission);
    }

    @Override
    public boolean delete(String id, String accessJWT) {
        if (isSeatRemovabe(id)) {
            return super.delete(id, accessJWT);
        }
        return false;
    }

    public void deleteAll(List<Seat> seats, String accessJWT) throws SecurityException, AuthRequired {

        // Ověř oprávnění
        verifyAccess(accessJWT, deletePermissionRequired());

        for (Seat seat : seats) {
            if (!isSeatRemovabe(seat.getId())) {
                return;
            }
        }

        repository.deleteAll(seats);
    }

    public boolean isSeatRemovabe(String seatId) {
        return reservationRepository.findBySeat(seatId).isEmpty();
    }
}
