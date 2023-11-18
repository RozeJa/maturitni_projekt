package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.stable.Hall;
import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.repositories.HallRepository;
import cz.rozek.jan.cinema_town.repositories.ProjectionRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class HallService extends CrudService<Hall, HallRepository> {

    private SeatService seatService;
    private ProjectionRepository projectionRepository;

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
    @Autowired
    public void setSeatService(SeatService seatService) {
        this.seatService = seatService;
    }
    @Autowired 
    public void setProjectionRepository(ProjectionRepository projectionRepository) {
        this.projectionRepository = projectionRepository;
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

    @Override
    public Hall create(Hall entity, String accessJWT) throws ValidationException {
        
        // přidej sedadla do db
        addSeatsToDB(entity, accessJWT);

        return super.create(entity, accessJWT);
    }

    @Override
    public Hall update(String id, Hall entity, String accessJWT) throws ValidationException {
    
        // přidej nová sedadla do db
        addSeatsToDB(entity, accessJWT);

        // ! odeber z db odebraná sedadla

        return super.update(id, entity, accessJWT);
    }

    private void addSeatsToDB(Hall entity, String accessJWT) throws ValidationException {
        
        Map<String, Seat> hallSeats = new HashMap<>();

        for (Seat seat : entity.getSeats().values()) {
            if (seat.getId() == null) {
                Seat seatFromDB = seatService.create(seat, accessJWT);
                hallSeats.put(seatFromDB.getId(), seatFromDB);
            } else {
                hallSeats.put(seat.getId(), seat);
            }
        }

        entity.setSeats(hallSeats);
    }

    @Override
    public boolean delete(String id, String accessJWT) {
        Optional<Hall> hallOptional = repository.findById(id);
        if (hallOptional.isPresent()) {
            Hall hall = hallOptional.get();
            
            if (isHallRemovable(hall.getId())) {
                /*
                for (Seat[] row : hall.getSeats()) {
                    for (Seat seat : row) {
                        seatService.delete(seat.getId(), accessJWT);
                    }
                }*/
                for (Seat seat : hall.getSeats().values()) {
                    seatService.delete(seat.getId(), accessJWT);
                }

                return super.delete(id, accessJWT);
            }
        }
        
        return false;
    }

    public boolean isHallRemovable(String id) {
        return projectionRepository.findByHallId(id).isEmpty();
    }
}
