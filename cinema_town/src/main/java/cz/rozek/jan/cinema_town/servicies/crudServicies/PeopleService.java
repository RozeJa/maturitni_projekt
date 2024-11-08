package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.primary.Film;
import cz.rozek.jan.cinema_town.models.primary.People;
import cz.rozek.jan.cinema_town.models.primary.User;
import cz.rozek.jan.cinema_town.repositories.FilmRepository;
import cz.rozek.jan.cinema_town.repositories.PeopleRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class PeopleService extends CrudService<People, PeopleRepository> {

    @Autowired
    private FilmRepository filmRepository;
    
    @Autowired
    @Override
    public void setRepository(PeopleRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "people-read";
    }
    @Override
    public String createPermissionRequired() {
        return "people-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "people-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "people-delete";
    }

    @Override
    public boolean delete(String id, String accessJWT) {

        People toRemove = repository.findById(id).get();

        // najdi ty filmy, ve kterých se vyskytuje daný člověk
        List<Film> directorsFilms = filmRepository.findByActors(toRemove);
        List<Film> actorsFilms = filmRepository.findByActors(toRemove);
        
        // pokud se někde vyskytuje nejde odebrat
        if (directorsFilms.size() + actorsFilms.size() == 0)    
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
