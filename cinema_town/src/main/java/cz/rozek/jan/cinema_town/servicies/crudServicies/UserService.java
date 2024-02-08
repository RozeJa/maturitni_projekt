package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.List;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.ReservationRepository;
import cz.rozek.jan.cinema_town.repositories.UserRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;
import cz.rozek.jan.cinema_town.servicies.auth.SecurityException;

@Service
public class UserService extends CrudService<User, UserRepository> {

    @Autowired
    private ReservationRepository reservationRepository;

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
    public User readById(String id, String accessJWT) {
        // načti si uživatele, který požádal o záznam uživatele
        User userWithInitRequest = verifyAccess(accessJWT, null);
        
        // načti záznam
        User entity = repository.findById(id).get();

        if (!userWithInitRequest.getId().equals(id)) {
            // ověř oprávnění
            verifyAccess(accessJWT, readPermissionRequired());
        }

        // pokud záznam existuje vrať ho 
        if (entity != null) {
            return entity;
        }
        
        // jinak vyvolej vyjímku
        throw new NullPointerException();
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

        if (editor.getRole().getName().equals("admin")) {

            List<User> admins = repository.findAllByRole(userFromDB.getRole());
            if (
                editor.getId().equals(id) && 
                admins.size() <= 1 && 
                !entity.getRole().getId().equals(editor.getRole().getId())
                ) 
                throw new SecurityException("Last admin cant change his role.");
            
            userFromDB.setRole(entity.getRole());
        }

        if (editor.getId().equals(id)) {
            userFromDB.setSubscriber(entity.isSubscriber());
        }

        return super.update(id, userFromDB, accessJWT);
    }

    @Override
    public boolean delete(String id, String accessJWT) {

        User toRemove = repository.findById(id).get();

        List<User> usersWithRSameRole = repository.findAllByRole(toRemove.getRole());
        if (toRemove.getRole().getName().equals("admin") && usersWithRSameRole.size() <= 1) {
            throw new SecurityException("You cannot remove last admin.");
        }

        // najdi si a odeber všechny rezervace odebíraného uživatele
        List<Reservation> reservations = reservationRepository.findByUser(toRemove);

        for (Reservation reservation : reservations) {
            reservationRepository.delete(reservation);
        }
        
        return super.delete(id, accessJWT);
    }
}
