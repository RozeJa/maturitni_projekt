package cz.rozek.jan.cinema_town.servicies;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import cz.rozek.jan.cinema_town.servicies.auth.SecurityException;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

// abstraktní, defaultní implementace služby pro výměnu dat mezi aplikací a databází  
// účelem této třídy a tříd, které ji rozšiřují je práce s daty
public abstract class CrudService<E extends Entity, R extends MongoRepository<E, String>> {
    
    // použitý repozitář
    protected R repository;
    // složba pro ověření oprávnění 
    protected AuthService authService;

    // metody pro vložení závislostí
    public abstract void setRepository(R repository);
    public abstract void setAuthService(AuthService authService);

    // konkrétní služba musí definovat potřebná oprávnění pro provedení jednotlivých operací CRUD
    public abstract String readPermissionRequired();
    public abstract String createPermissionRequired();
    public abstract String updatePermissionRequired();
    public abstract String deletePermissionRequired();

    // metoda, která ověří přístup, pokud s požadevkem nebyl zaslán přístupový JWT
    protected boolean verifyNullToken(String requiredActivity) {
        return false;
    }

    /**
     * metoda získá všechny záznamy
     * @param accessJWT přístupový JWT
     * @return list záznamů
     * @throws SecurityException pokud uživatel nemá oprávnění 
     */
    public List<E> readAll(String accessJWT) throws SecurityException {
    
        // ověř oprávnění 
        verifyAccess(accessJWT, readPermissionRequired());

        // načti záznamy
        List<E> entities = repository.findAll();
        return entities;
    }

    /**
     * metoda pro získání jednoho konkrétního záznamu
     * @param id id záznamu
     * @param accessJWT přístupový JWT
     * @return záznam s pořadovaným id
     * @throws SecurityException pokud uživatel nemá oprávnění 
     */
    public E readById(String id, String accessJWT) throws SecurityException {

        // ověř oprávnění 
        verifyAccess(accessJWT, readPermissionRequired());

        // načti záznam
        E entity = repository.findById(id).get();

        // pokud záznam existuje vrať ho 
        if (entity != null) {
            return entity;
        }
        
        // jinak vyvolej vyjímku
        throw new NullPointerException();
    }

    /**
     * metoda pro vytvoření záznamu
     * @param entity zádnam 
     * @param accessJWT přístupový JWT
     * @return uložený záznam
     * @throws SecurityException pokud uživatel nemá oprávnění 
     */
    public E create(E entity, String accessJWT) throws SecurityException {

        // ověř oprávnění 
        verifyAccess(accessJWT, createPermissionRequired());

        // vynuluj id
        entity.setId(null);

        // ulož
        E saved = repository.save(entity);

        return saved;
    }

    /**
     * matoda pro editaci záznamu
     * @param id id editovaného záznamu
     * @param entity editovaný záznam 
     * @param accessJWT přístupový JWT
     * @return editovaný záznam
     * @throws SecurityException pokud uživatel nemá oprávnění 
     */
    public E update(String id, E entity, String accessJWT) throws SecurityException {
        
        // ověř oprávnění 
        verifyAccess(accessJWT, updatePermissionRequired());

        // nastav id
        entity.setId(id);

        // ulož změny
        E updated = repository.save(entity);

        return updated;
    }

    /**
     * metoda pro smazání záznamu 
     * @param id id mazaného záznamu
     * @param accessJWT příístupový JWT
     * @return true pokud byl záznam smazán 
     * @throws SecurityException pokud uživatel nemá oprávnění 
     */
    public boolean delete(String id, String accessJWT) throws SecurityException {
        
        // ověř oprávnění 
        verifyAccess(accessJWT, deletePermissionRequired());

        // načti záznam 
        E entity = repository.findById(id).get();

        // pokud záznam existuje smaž ho 
        if (entity == null) {
            repository.delete(entity);
            return true;
        }
        return false;
    }

    /**
     * matoda pro ověření přístupu 
     * @param accessJWT přístupový JWT
     * @param permission požadované oprávnění 
     * @throws SecurityException pokud uživatel nemá oprávnění  
     */
    protected void verifyAccess(String accessJWT, String permission) throws SecurityException {
        // pokud přístupový JWT je null prověř, zda i přes to může uživatel provést akci
        if (accessJWT == null) {
            if (!verifyNullToken(permission)) {
                throw new SecurityException("Access with null token refused");
            }
            // pokud oprávnění není null ověř zda uživatel má toto oprávnění 
        } else if (permission != null) {
            authService.verifyAccess(accessJWT, permission);
        }
    }

}
