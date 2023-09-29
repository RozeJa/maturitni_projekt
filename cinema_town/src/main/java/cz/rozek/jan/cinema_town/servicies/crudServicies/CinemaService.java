package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Cinema;
import cz.rozek.jan.cinema_town.repositories.CinemaRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class CinemaService extends CrudService<Cinema, CinemaRepository> {
    
    @Autowired
    @Override
    public void setRepository(CinemaRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "cinema-read";
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

    // TODO metoda create múže dostat v Cinema i záznamy mimo DB, ty je třeba nejprve uložit do db
    @Override
    public Cinema create(Cinema entity, String accessJWT) {
        // TODO Auto-generated method stub
        return super.create(entity, accessJWT);
    }

    // TODO metoda update může dastat v Cinema i záznamy mino DB, ty je třeba nejprve uložit do db. Případně je třeba smazat odebrané záznamy
    @Override
    public Cinema update(String id, Cinema entity, String accessJWT) {
        // TODO Auto-generated method stub
        return super.update(id, entity, accessJWT);
    }

    // TODO kino bude možné odebrat jen pokud neexistují záznamy na něm závislé
    @Override
    public boolean delete(String id, String accessJWT) {
        // TODO Auto-generated method stub
        return super.delete(id, accessJWT);
    }
}
