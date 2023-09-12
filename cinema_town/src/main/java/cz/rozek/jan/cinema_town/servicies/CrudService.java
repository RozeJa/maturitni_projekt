package cz.rozek.jan.cinema_town.servicies;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import cz.rozek.jan.cinema_town.servicies.auth.SecurityException;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

public abstract class CrudService<E extends Entity, R extends MongoRepository<E, String>> {
    
    protected R repository;
    protected AuthService authService;

    public abstract void setRepository(R repository);
    public abstract void setAuthService(AuthService authService);

    public abstract String readPermissionRequired();
    public abstract String createPermissionRequired();
    public abstract String updatePermissionRequired();
    public abstract String deletePermissionRequired();

    protected boolean verifyNullToken(String requiredActivity) {
        return false;
    }

    public List<E> readAll(String accessJWT) throws SecurityException {
        
        verifyAccess(accessJWT, readPermissionRequired());

        List<E> entities = repository.findAll();
        return entities;
    }

    public E readById(String id, String accessJWT) throws SecurityException {

        verifyAccess(accessJWT, readPermissionRequired());

        E entity = repository.findById(id).get();

        if (entity != null) {
            return entity;
        }

        throw new NullPointerException();
    }

    public E create(E entity, String accessJWT) throws SecurityException {

        verifyAccess(accessJWT, createPermissionRequired());

        entity.setId(null);

        E saved = repository.save(entity);

        return saved;
    }

    public E update(String id, E entity, String accessJWT) throws SecurityException {
        
        verifyAccess(accessJWT, updatePermissionRequired());

        entity.setId(id);

        E updated = repository.save(entity);

        return updated;
    }

    public boolean delete(String id, String accessJWT) throws SecurityException {
        
        verifyAccess(accessJWT, deletePermissionRequired());

        E entity = repository.findById(id).get();

        if (entity == null) {
            repository.delete(entity);
            return true;
        }
        return false;
    }

    protected void verifyAccess(String accessJWT, String permission) throws SecurityException {
        if (accessJWT == null) {
            if (!verifyNullToken(permission)) {
                throw new SecurityException("Access with null token refused");
            }
        } else if (permission != null) {
            authService.verifyAccess(accessJWT, permission);
        }
    }

}
