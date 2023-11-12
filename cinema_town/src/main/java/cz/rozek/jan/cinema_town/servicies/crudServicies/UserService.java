package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
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
    public User create(User entity, String accessJWT) throws ValidationException {
        
        // zvaliduj email
        if (!entity.validateEmail()) 
            throw new SecurityException("Invalid email");
        entity.setPassword(BCrypt.hashpw(entity.getPassword(), BCrypt.gensalt()));

        return super.create(entity, accessJWT);
    }

    @Override
    public User update(String id, User entity, String accessJWT) throws ValidationException {

        User userFromDB = repository.findById(id).get();

        User editor = authService.verifyAccess(accessJWT, "user-update");

        if (editor.getRole().getName().equals("admin")) 
            userFromDB.setRole(entity.getRole());

        if (editor.getId().equals(id)) {
            userFromDB.setTrustedDevicesId(entity.getTrustedDevicesId());
            userFromDB.setSubscriber(entity.isSubscriber());
        }


        return super.update(id, userFromDB, accessJWT);
    }

    @Override
    public boolean delete(String id, String accessJWT) {

        // TODO zkontrolovat pokud se odebírá admin, tak nebylo možné odebrat posledního

        return super.delete(id, accessJWT);
    }
}
