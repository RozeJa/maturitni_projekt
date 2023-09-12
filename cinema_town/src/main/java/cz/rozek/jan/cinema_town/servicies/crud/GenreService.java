package cz.rozek.jan.cinema_town.servicies.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Genre;
import cz.rozek.jan.cinema_town.repositories.GenreRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class GenreService extends CrudService<Genre, GenreRepository> {
    
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
}
