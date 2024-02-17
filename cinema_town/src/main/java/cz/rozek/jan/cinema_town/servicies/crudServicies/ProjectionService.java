package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.models.stable.Hall;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.HallRepository;
import cz.rozek.jan.cinema_town.repositories.ProjectionRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class ProjectionService extends CrudService<Projection, ProjectionRepository> {
    @Autowired
    private HallRepository hallRepository;

    @Autowired
    @Override
    public void setRepository(ProjectionRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }
 
    @Override
    public String readPermissionRequired() {
        return "projection-read";
    }
    @Override
    public String createPermissionRequired() {
        return "projection-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "projection-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "projection-delete";
    }

    public List<Projection> readByFilmId(String filmId, String accessJWT) {
        List<Projection> entities = readAll(accessJWT);
            entities = entities.stream()
            .filter(e -> e.getDateTime().isAfter(LocalDateTime.now()))
            .filter(e -> e.getFilm().getId().equals(filmId))
            .toList();
        
        return entities;
    }

    @Override
    public Projection create(Projection entity, String accessJWT) throws ValidationException {
        
        // otejtuj, zda promítání nebude kolidovat s jiným promítáním
        if (!isSpaceTimeValid(entity))
            throw new ValidationException("V zadaný čas a v zadaném sálu není možné promítání uskutečnit, protože v ten čas tam již probýhá jiné.");

        return super.create(entity, accessJWT);
    }
    @Override
    public Projection update(String id, Projection entity, String accessJWT) throws ValidationException {

        // otejtuj, zda promítání nebude kolidovat s jiným promítáním
        if (!isSpaceTimeValid(entity))
            throw new ValidationException("V zadaný čas a v zadaném sálu není možné promítání uskutečnit, protože v ten čas tam již probýhá jiné.");

        return super.update(id, entity, accessJWT);
    }

    private boolean isSpaceTimeValid(Projection projection) {
        Hall hall = hallRepository.findById(projection.getHall().getId()).get();

        List<Projection> projections = repository.findByHall(hall);

        for (Projection p : projections) {
            if (p.intersect(projection)) {
                return false;
            }
        }

        return true;
    }

    @Override
    public User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException, AuthRequired {
                
        if (requiredPermission.equals(readPermissionRequired())) {
            return null;
        } 

        return super.verifyAccess(accessJWT, requiredPermission);
    }
}