package cz.rozek.jan.cinema_town.models.stable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance reprezentuje Město
@Document("cities")
@Data
@NoArgsConstructor
public class City implements Entity {

    @Id
    private String id;

    // název města
    @Indexed(unique = true)
    private String name = "";

    @Override
    public void validate() throws ValidationException {
        try {
            if (name.isBlank())
                throw new ValidationException("Není zadaný název města.");
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        }
    }
}
