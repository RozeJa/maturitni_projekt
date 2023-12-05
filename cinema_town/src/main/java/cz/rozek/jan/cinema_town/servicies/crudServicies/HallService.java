package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.models.stable.Cinema;
import cz.rozek.jan.cinema_town.models.stable.Hall;
import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.repositories.CinemaRepository;
import cz.rozek.jan.cinema_town.repositories.HallRepository;
import cz.rozek.jan.cinema_town.repositories.ProjectionRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class HallService extends CrudService<Hall, HallRepository> {

    private SeatService seatService;
    private ProjectionRepository projectionRepository;
    private CinemaRepository cinemaRepository;

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
    @Autowired
    public void setCinemaRepository(CinemaRepository cinemaRepository) {
        this.cinemaRepository = cinemaRepository;
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
        editSeats(entity, accessJWT);

        return super.create(entity, accessJWT);
    }

    public List<Hall> readAllUnremovable(String cinemaID, String accessJWT) {
        Cinema c = cinemaRepository.findById(cinemaID).get();

        List<Hall> halls = c.getHalls()
        .values()
        .stream()
        .toList();
        List<Projection> projections = projectionRepository.findByHall(halls);
        return projections.stream()
        .map(p -> p.getHall())
        .distinct()
        .toList();
    }

    @Override
    public Hall update(String id, Hall entity, String accessJWT) throws ValidationException {

        Hall editedFromDB = repository.findById(id).get();
    
        // přidej nová sedadla do db
        editSeats(entity, accessJWT);

        // ! odeber z db odebraná sedadla
        List<Seat> removedSeats = editedFromDB.getSeats().values().stream().filter(s -> entity.getSeats().get(s.getId()) == null).toList();

        seatService.deleteAll(removedSeats, accessJWT);

        return super.update(id, entity, accessJWT);
    }

    private void editSeats(Hall entity, String accessJWT) throws ValidationException {
        
        Map<String, Seat> hallSeats = new HashMap<>();

        for (Seat seat : entity.getSeats().values()) {
            if (seat.getId() == null) {
                Seat seatFromDB = seatService.create(seat, accessJWT);
                hallSeats.put(seatFromDB.getId(), seatFromDB);
            } else {
                Seat updated = seatService.update(seat.getId(), seat, accessJWT);
                hallSeats.put(seat.getId(), updated);
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
                boolean removed = super.delete(id, accessJWT);
                seatService.deleteAll(hall.getSeats().values().stream().toList(), accessJWT);

                return removed;
            }
        }
        
        return false;
    }

    public boolean isHallRemovable(String id) {
        Hall toRemove = repository.findById(id).get();
        return projectionRepository.findByHall(toRemove).isEmpty();
    }
}
