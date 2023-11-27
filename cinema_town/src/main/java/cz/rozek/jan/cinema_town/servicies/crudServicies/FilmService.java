package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.models.stable.People;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.FilmRepository;
import cz.rozek.jan.cinema_town.repositories.PeopleRepository;
import cz.rozek.jan.cinema_town.repositories.ProjectionRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;
import cz.rozek.jan.cinema_town.servicies.auth.SecurityException;

@Service
public class FilmService extends CrudService<Film, FilmRepository> {

    @Autowired
    private ProjectionRepository projectionRepository;
    @Autowired
    private PeopleRepository peopleRepository;
    
    @Autowired
    @Override
    public void setRepository(FilmRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "film-read";
    }
    @Override
    public String createPermissionRequired() {
        return "film-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "film-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "film-delete";
    }

    @Override
    public Film create(Film entity, String accessJWT) throws ValidationException {
        
        pushPeoplesToDB(entity);

        return super.create(entity, accessJWT);
    }

    @Override
    public Film update(String id, Film entity, String accessJWT) throws ValidationException {
        
        pushPeoplesToDB(entity);

        return super.update(id, entity, accessJWT);
    }

    private void pushPeoplesToDB(Film entity) {
        // projeď režiséra a herce, pokud tam je nějaký, který nemá id, tak ho přidej do db a objektu přidej id
        Map<String, People> addedToDB = new HashMap<>();
        for (People people : entity.getActors().values()) {
            People p = peopleRepository.findByNameAndSurname(people.getName(), people.getSurname());
            if (p == null) {
                // TODO kontrola člověka
                People newPeople = peopleRepository.save(entity.getActors().get(p.getId()));
                addedToDB.put(p.getId(), newPeople);
            }
        }

        for (String id : addedToDB.keySet()) {
            entity.getActors().remove(id);
            entity.getActors().put(addedToDB.get(id).getId(), addedToDB.get(id));
        }

        People o = null;
        if (entity.getDirector().getId() != null) {
            o = peopleRepository.findByNameAndSurname(entity.getDirector().getName(), entity.getDirector().getSurname());
            if (o == null) {
                // TODO kontrola člověka
                People newPeople = peopleRepository.save(entity.getDirector());
                entity.setDirector(newPeople);
            }
        } else {
            // TODO kontrola člověka
            People newPeople = peopleRepository.save(entity.getDirector());
            entity.setDirector(newPeople);
        }
    }

    @Override
    public boolean delete(String id, String accessJWT) {
    
        Film toRemove = repository.findById(id).get();

        // pokud film není přiřazený u žádného promítání můžeš ho odebrat
        if (projectionRepository.findByFilm(toRemove).isEmpty())
            return super.delete(id, accessJWT);
            
        return false;
    }

    @Override
    public User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException, AuthRequired {
        
        if (requiredPermission.equals(readPermissionRequired())) {
            return null;
        } 

        return super.verifyAccess(accessJWT, requiredPermission);
    }
}
