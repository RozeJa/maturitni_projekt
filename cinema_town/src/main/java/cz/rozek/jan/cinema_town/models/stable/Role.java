package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import lombok.Data;
import lombok.NoArgsConstructor;

// Třída představuje roly 
@Document("roles")
@Data
@NoArgsConstructor
public class Role implements Entity {
    
    @Id
    private String id;

    // název role
    @Indexed(unique = true)
    private String name;

    // oprávnění mapované id => oprávnění
    @DBRef
    private Map<String, Permission> permissions = new HashMap<>();

    /**
     * Metoda pro ověření zda role obsahuje dané oprávnění 
     * @param requiredPermission požadované oprávnění 
     * @return true pokud role obsahuje oprávnění 
     */
    public boolean containsPermission(String requiredPermission) {
        // projeď včechna oprávnění 
        for (Permission p : permissions.values()) {
            // pokud se oprávnění shoduje vrat true
            if (p.getPermission().equals(requiredPermission)) {
                return true;
            }
        }

        // pokud se žádné neshodují, vrať false
        return false;
    }

    @Override
    public void validate() throws ValidationException {
        if (name == null)
            throw new ValidationException("Name cant be null.");
        if (name.isBlank())
            throw new ValidationException("Name cant be empty.");
    }
}
