package cz.rozek.jan.cinema_town.servicies.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.repositories.FilmRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class FilmService extends CrudService<Film, FilmRepository> {
    
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
}