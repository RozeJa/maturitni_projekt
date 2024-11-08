package cz.rozek.jan.cinema_town.models.primary;

import java.util.HashMap;
import java.util.Map;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance reprezentuje kino
@Document("cinemas")
@Data
@NoArgsConstructor
public class Cinema implements Entity {

    @Id
    private String id;

    // město, ve kterém se kino nachází
    @NotNull
    @DBRef
    private City city;
    // název ulice, z které je vstup do kina
    private String street = "";
    // číslo popisné 
    private String houseNumber = "";

    // seznam sálů kina; mapování id => sál
    @DBRef
    private Map<String, Hall> halls = new HashMap<>();

    @Override
    public void validate() throws ValidationException {
        try {
            if (city == null)
                throw new ValidationException("Není zadané žádné město.");
            if (street.isBlank())
                throw new ValidationException("Není zadaná žádné ulice.");             
            if (houseNumber.isBlank())
                throw new ValidationException("Není zadané číslo popisné.");
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        }
    }
}
