package cz.rozek.jan.cinema_town.models.stable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance představuje film
@Document("films")
@Data
@NoArgsConstructor
public class Film implements Entity {
    
    @Id
    private String id;

    // název filmu
    @Indexed(unique = true)
    private String name;
    // popis děje filmu
    private String description;
    // adresa k filmu
    private String picture;
    // adresa k traileru na youtube
    private String trailer;
    // originání znění
    @Size(min = 2, max = 3)
    private String original;
    // určuje zda se jedná o trhák
    private boolean blockBuster = false;

    // režisér
    @NotNull
    @DBRef
    private People director;
    // herci mapovaní id => herec
    @DBRef
    private Map<String, People> actors = new HashMap<>();
    // žánry mapování id =>žánr
    @DBRef
    private List<Genre> genres = new ArrayList<>();

    // titulky
    private List<String> titles = new ArrayList<>();
    // dabingy
    private List<String> dabings = new ArrayList<>();
    
    // kolik minut film trvá
    @Min(0)
    private int time;
    // věková hranice
    @Min(0)
    private int pg;
    // cena lístku, která bude předvyplněna u promítání
    @Min(0)
    private double defaultCost;
    
    // datum kdy byl film vypuštěn
    @NotNull
    @JsonProperty
    private LocalDate production;
    // den premiéry 
    @NotNull
    @JsonProperty
    private LocalDate premier;

    @Override
    public void validate() throws ValidationException {
        try {
            if (name.isBlank())
                throw new ValidationException("Film name cant be empty.");
            if (description.isBlank())
                throw new ValidationException("Film description cant be empty."); 
            if (original.isBlank())
                throw new ValidationException("Film original cant be empty.");
            if (original.length() > 3) 
                throw new ValidationException("Max lenght of original is 3 chars.");
        } catch (Exception e) {
                throw new ValidationException("Some prop is null. Cant be."); 
        }
        if (picture == null)
            picture = "";
        if (trailer == null)
            trailer = "";
        if (director == null)
            throw new ValidationException("Director cant be null.");
        if (genres.size() == 0) 
            throw new ValidationException("Film must be at least one genre.");
        if (time <= 0)
            throw new ValidationException("Time cant be negative or zero.");
        if (time > 720)
            throw new ValidationException("Time cant be bigger number that 720 minits.");
        if (pg <= 3) 
            throw new ValidationException("PG cant be negative or zero.");
        if (pg > 99)
            throw new ValidationException("Invalid pg number. Limit is 99");
        if (defaultCost < 0) 
            throw new ValidationException("Default cost cant be negative.");

    }
}
