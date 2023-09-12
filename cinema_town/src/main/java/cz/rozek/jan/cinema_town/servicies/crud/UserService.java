package cz.rozek.jan.cinema_town.servicies.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.UserRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class UserService extends CrudService<User, UserRepository> {

    @Autowired
    @Override
    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "user-read";
    }
    @Override
    public String createPermissionRequired() {
        return "user-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "user-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "user-delete";
    }
}
