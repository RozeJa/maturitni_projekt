package cz.rozek.jan.cinema_town.models.primary;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance slouží pro uchování jména a příjmení herce nego režiséra
@Document("people")
@Data
@NoArgsConstructor
public class People implements Entity {
    
    @Id
    private String id;

    // jméno
    private String name = "";
    // přijmení    
    private String surname = "";

    @Override
    public void validate() throws ValidationException {
        try {
            if (surname.isBlank())
                throw new ValidationException("Osoba musí mít alespoň vyplněné přijmení.");
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        }
    }
}
