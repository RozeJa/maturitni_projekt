package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.SeatRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class SeatService extends CrudService<Seat, SeatRepository> {
    
    @Autowired
    @Override
    public void setRepository(SeatRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "seat-read";
    }
    @Override
    public String createPermissionRequired() {
        return "seat-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "seat-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "seat-delete";
    }    
    
    @Override
    public User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException, AuthRequired {
        
        if (requiredPermission.equals(readPermissionRequired())) {
            return null;
        } 

        return super.verifyAccess(accessJWT, requiredPermission);
    }

    @Override
    public boolean delete(String id, String accessJWT) {
        // TODO možná ošetřit, že sedeadlo nepůjde odebrat, pokud už na něj byla provedena rezervace
        
        return super.delete(id, accessJWT);
    }

    public void deleteAll(List<Seat> seats, String accessJWT) throws SecurityException, AuthRequired {

        // TODO možná ošetřit, že sedeadlo nepůjde odebrat, pokud už na něj byla provedena rezervace

        // Ověř oprávnění
        verifyAccess(accessJWT, deletePermissionRequired());

        repository.deleteAll(seats);
    }
}
