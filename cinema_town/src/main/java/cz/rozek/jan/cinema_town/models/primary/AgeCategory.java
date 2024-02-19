package cz.rozek.jan.cinema_town.models.primary;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("age_categories")
@Data
@NoArgsConstructor
public class AgeCategory implements Entity {
    
    @Id
    private String id;

    // název kategorie
    private String name = "";
    // kolik procent z ceny se má uvažovat, jako cena pro kategorii
    private double priceModificator = 1;

    @Override 
    public void validate() throws ValidationException {
        try {
            if (name.isEmpty()) {
                throw new ValidationException("Není uveden název kategorie.");
            }
            if (priceModificator < 0) {
                throw new ValidationException("Cenový monifikátor nemůže být manší než nula.");
            }
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        }
    }
}
