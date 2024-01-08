package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.AgeCategory;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.AgeCategoryRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service 
public class AgeCategoryService extends CrudService<AgeCategory, AgeCategoryRepository> {

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
    public User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException, AuthRequired {
        
        if (requiredPermission.equals(readPermissionRequired())) {
            return null;
        } 

        return super.verifyAccess(accessJWT, requiredPermission);
    }
}
