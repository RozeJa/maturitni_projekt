package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.City;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.CityRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class CityService extends CrudService<City, CityRepository> {
    
    @Autowired
    @Override
    public void setRepository(CityRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    // TODO tyto oprávnění je třeba přidat do db

    @Override
    public String readPermissionRequired() {
        return "city-read";
    }
    @Override
    public String createPermissionRequired() {
        return "cinema-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "cinema-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "cinema-delete";
    }

    @Override
    protected User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException, AuthRequired {
        
        if (requiredPermission.equals(readPermissionRequired())) {
            return null;
        } 

        return super.verifyAccess(accessJWT, requiredPermission);
    }
}
