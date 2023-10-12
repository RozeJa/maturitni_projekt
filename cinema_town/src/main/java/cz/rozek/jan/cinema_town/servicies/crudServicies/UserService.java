package cz.rozek.jan.cinema_town.servicies.crudServicies;

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

    @Override
    public User update(String id, User entity, String accessJWT) {

        User userFromDB = repository.findById(id).get();

        User editor = authService.verifyAccess(accessJWT, "user-edit");

        if (editor.getRole().getName().equals("admin")) 
            userFromDB.setRole(entity.getRole());

        if (editor.getId().equals(id))
            userFromDB.setSubscriber(entity.isSubscriber());


        return super.update(id, userFromDB, accessJWT);
    }
}
