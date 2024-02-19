package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.primary.AgeCategory;
import cz.rozek.jan.cinema_town.models.primary.User;
import cz.rozek.jan.cinema_town.repositories.AgeCategoryRepository;
import cz.rozek.jan.cinema_town.repositories.ReservationRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service 
public class AgeCategoryService extends CrudService<AgeCategory, AgeCategoryRepository> {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    @Override
    public void setRepository(AgeCategoryRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "ageCategory-read";
    }
    @Override
    public String createPermissionRequired() {
        return "ageCategory-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "ageCategory-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "ageCategory-delete";
    }

    @Override
    public boolean delete(String id, String accessJWT) {

        AgeCategory ac = repository.findById(id).get();
        if (reservationRepository.findByAgeCategory(ac).isEmpty())
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
