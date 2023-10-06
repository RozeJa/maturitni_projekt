package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Genre;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.FilmRepository;
import cz.rozek.jan.cinema_town.repositories.GenreRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class GenreService extends CrudService<Genre, GenreRepository> {
    
    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    @Override
    public void setRepository(GenreRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "genre-read";
    }
    @Override
    public String createPermissionRequired() {
        return "genre-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "genre-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "genre-delete";
    }

    @Override
    public boolean delete(String id, String accessJWT) {

        // pokud se tento žánr vyskytuje alespoň u jednoho filmu nemůže být odebrán
        if (filmRepository.findByGenresId(id).isEmpty()) 
            return super.delete(id, accessJWT);

        return false;
    }

    @Override
    protected User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException, AuthRequired {
        
        if (requiredPermission.equals(readPermissionRequired())) {
            return null;
        } 

        return super.verifyAccess(accessJWT, requiredPermission);
    }
}
