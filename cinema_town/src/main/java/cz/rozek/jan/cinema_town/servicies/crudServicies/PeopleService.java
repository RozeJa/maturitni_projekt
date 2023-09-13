package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.People;
import cz.rozek.jan.cinema_town.repositories.PeopleRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class PeopleService extends CrudService<People, PeopleRepository> {
    
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
}
