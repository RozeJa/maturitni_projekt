package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.stable.Cinema;
import cz.rozek.jan.cinema_town.models.stable.City;
import cz.rozek.jan.cinema_town.models.stable.Hall;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.CinemaRepository;
import cz.rozek.jan.cinema_town.repositories.CityRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;
import cz.rozek.jan.cinema_town.servicies.auth.SecurityException;

@Service
public class CinemaService extends CrudService<Cinema, CinemaRepository> {

    private HallService hallService;
    private CityService cityService;
    private CityRepository cityRepository;
    
    @Autowired
    @Override
    public void setRepository(CinemaRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }
    @Autowired
    public void setHallService(HallService hallService) {
        this.hallService = hallService;
    }
    @Autowired
    public void setCityService(CityService cityService) {
        this.cityService = cityService;
    }
    @Autowired
    public void setCityRepository(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    public String readPermissionRequired() {
        return "cinema-read";
    }
    @Override
    public String createPermissionRequired() {
        return "cinema-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "cinema-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "cinema-delete";
    }

    @Override
    public Cinema create(Cinema entity, String accessJWT) throws ValidationException {

        // pokud existuje to město, tak ho tam přidej 
        City city = cityRepository.findByName(entity.getCity().getName());
        if (city == null) 
            city = cityService.create(entity.getCity(), accessJWT);

        entity.setCity(city);
        
        // ulož kinu sály abys zízkal jejich id a ěl je pak podle čaho namapovat
        addHallsToDB(entity, accessJWT);
        
        return super.create(entity, accessJWT);
    }

    @Override
    public Cinema update(String id, Cinema entity, String accessJWT) throws ValidationException {

        Cinema cinemaFormDB = repository.findById(entity.getId()).get();
        // pokud je jiné kino vyměň a pokud to co je v db už není nikde použité, tak ho odeber
        if (!cinemaFormDB.getCity().getId().equals(entity.getCity().getId())) {

            List<Cinema> cinameByCityName = repository.findByCityId(cinemaFormDB.getCity().getId());
            if (cinameByCityName.isEmpty()) {
                cityService.delete(cinemaFormDB.getCity().getId(), accessJWT);
            }

        }

        // kdyby bylo změna sálů, tak radši ulož kinu sály abys zízkal jejich id a ěl je pak podle čaho namapovat
        addHallsToDB(entity, accessJWT);

        // ! odeber z db odebrané sály
        // ! odeber z db odebraná sedadla

        return super.update(id, entity, accessJWT);
    }

    private void addHallsToDB(Cinema entity, String accessJWT) throws ValidationException {
        Map<String, Hall> cinemaHalls = new HashMap<>();
        if (entity.getHalls() == null) {
            entity.setHalls(cinemaHalls);
            return;
        }

        for (Hall hall : entity.getHalls().values()) {
            if (hall.getId() == null) {
                Hall hallFromDB = hallService.create(hall, accessJWT);
                cinemaHalls.put(hallFromDB.getId(), hallFromDB);
            } else {
                cinemaHalls.put(hall.getId(), hall);
            }
        }

        entity.setHalls(cinemaHalls);
    }

    @Override
    public boolean delete(String id, String accessJWT) {
        Optional<Cinema> cinemaOptional = repository.findById(id);
        if (cinemaOptional.isPresent()) {
            Cinema cinema = cinemaOptional.get();

            if (isCinemaRemovable(cinema)) {

                for (Hall hall : cinema.getHalls().values()) {
                    hallService.delete(hall.getId(), accessJWT);
                }

                return super.delete(id, accessJWT);
            }
        }
        return false;

    }

    public boolean isCinemaRemovable(Cinema cinema) {
        for (Hall hall : cinema.getHalls().values()) {
            if (!hallService.isHallRemovable(hall.getId())) 
                return false;
        }

        return true;    
    }

    @Override
    public User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException, AuthRequired {
        
        if (requiredPermission.equals(readPermissionRequired())) {
            return null;
        } 

        return super.verifyAccess(accessJWT, requiredPermission);
    }
}
