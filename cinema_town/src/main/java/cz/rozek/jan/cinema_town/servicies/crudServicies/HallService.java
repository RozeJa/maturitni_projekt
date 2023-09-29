package cz.rozek.jan.cinema_town.servicies.crudServicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.Hall;
import cz.rozek.jan.cinema_town.repositories.HallRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class HallService extends CrudService<Hall, HallRepository> {

    @Autowired
    @Override
    public void setRepository(HallRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "hall-read";
    }
    @Override
    public String createPermissionRequired() {
        return "hall-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "hall-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "hall-delete";
    }

    // TODO metoda create může dostat v Hall i záznamy mino DB, ty je třeba nejprve uložit do DB
    @Override
    public Hall create(Hall entity, String accessJWT) {
        // TODO Auto-generated method stub
        return super.create(entity, accessJWT);
    }

    // TODO metoda update může dostat v Hall i záznamy, ty je třeba nejprve uložit do db. Případně je třeba smazat odebrané záznamy
    @Override
    public Hall update(String id, Hall entity, String accessJWT) {
        // TODO Auto-generated method stub
        return super.update(id, entity, accessJWT);
    }

    // TODO sál půjde odebrat jedině pokud v něm nebude naplánované žádné promítání 
    @Override
    public boolean delete(String id, String accessJWT) {
        // TODO Auto-generated method stub
        return super.delete(id, accessJWT);
    }
}
