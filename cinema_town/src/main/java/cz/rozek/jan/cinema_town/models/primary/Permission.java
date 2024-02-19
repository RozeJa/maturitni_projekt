package cz.rozek.jan.cinema_town.models.primary;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance představuje oprávnění 
// pokud role obsahuje oprávnění je uživatel oprávněn k provedení činnosti, která toto oprávnění vyžaduje 
@Document("permissions")
@Data
@NoArgsConstructor
public class Permission implements Entity {
    
    @Id
    private String id;

    // název oprávnění
    @Indexed(unique = true)
    private String permission = "";

    @Override
    public void validate() throws ValidationException {
        try {
            if (permission.isBlank())
                throw new ValidationException("Obrávnění musí být vyplněno.");
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        }
    }
}
