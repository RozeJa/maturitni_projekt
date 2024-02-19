package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.primary.Cinema;
import cz.rozek.jan.cinema_town.models.primary.City;
import cz.rozek.jan.cinema_town.models.primary.Hall;
import cz.rozek.jan.cinema_town.models.primary.User;
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
        editHalls(entity, accessJWT);
        
        return super.create(entity, accessJWT);
    }

    public Cinema readByHallId(String id, String accessJWT) {
        

        // ověř oprávnění
        verifyAccess(accessJWT, readPermissionRequired());

        // načti záznam
        Cinema entity = repository.findByHall(id);

        // pokud záznam existuje vrať ho 
        if (entity != null) {
            return entity;
        }
        
        // jinak vyvolej vyjímku
        throw new NullPointerException();
    }

    @Override
    public Cinema update(String id, Cinema entity, String accessJWT) throws ValidationException {
        
        // ověř oprávnění
        verifyAccess(accessJWT, updatePermissionRequired());
        
        entity.validate();

        Cinema cinemaFormDB = repository.findById(entity.getId()).get();
        // pokud je jiné kino vyměň a pokud to co je v db už není nikde použité, tak ho odeber
        if (!cinemaFormDB.getCity().getId().equals(entity.getCity().getId())) {

            List<Cinema> cinameByCityName = repository.findByCityId(cinemaFormDB.getCity().getId());
            if (cinameByCityName.isEmpty()) {
                cityService.delete(cinemaFormDB.getCity().getId(), accessJWT);
            }

        }

        // kdyby bylo změna sálů, tak radši ulož kinu sály abys zízkal jejich id a ěl je pak podle čaho namapovat
        editHalls(entity, accessJWT);
        
        // ! odeber z db odebrané sály
        // ! odeber z db odebraná sedadla -> se stane při odebrání sálů
        List<Hall> toRemove = cinemaFormDB.getHalls().values().stream().filter(h -> entity.getHalls().get(h.getId()) == null).toList();
        
        for (Hall hall : toRemove) {
            if (!hallService.delete(hall.getId(), accessJWT)) {
                entity.getHalls().put(hall.getId(), hall);
            }
        }

        // ulož změny
        repository.save(entity);
        Cinema updated = repository.findById(id).get();
        return updated;
    }

    private void editHalls(Cinema entity, String accessJWT) throws ValidationException {
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
                Hall updated = hallService.update(hall.getId(), hall, accessJWT);
                cinemaHalls.put(hall.getId(), updated);
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

                boolean removed = super.delete(id, accessJWT);

                for (Hall hall : cinema.getHalls().values()) {
                    hallService.delete(hall.getId(), accessJWT);
                }

                return removed;
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
