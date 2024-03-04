package cz.rozek.jan.cinema_town.models.primary;

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
@Document("films") // určí, že jde o třídu, jejíž instance je možné uložit do databáze mongoDB a to to kolekce 'films'
@Data // anotace poskytne metody get a set pro všechny vlastnosti třídy
@NoArgsConstructor // zaručí třídě bezparametrický konstruktor
public class Film implements Entity {
    
    @Id
    private String id;

    // název filmu
    @Indexed(unique = true)
    private String name = "";
    // popis děje filmu
    private String description = "";
    // adresa k filmu
    private String picture = "";
    // adresa k traileru na youtube
    private String trailer = "";
    // originání znění
    @Size(min = 2, max = 3)
    private String original = "";
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
    private int time = 0;
    // věková hranice
    @Min(0)
    private int pg = 0;
    // cena lístku, která bude předvyplněna u promítání
    @Min(0)
    private double defaultCost = 0;
    
    // v jaké zemi a kde byl film produkován
    private String production = "";
    // den premiéry 
    @NotNull
    @JsonProperty
    private LocalDate premier;

    @Override
    public void validate() throws ValidationException {
        try {
            if (name.isBlank())
                throw new ValidationException("Název filmu není vyplněn.");
            if (description.isBlank())
                throw new ValidationException("Popis filmu není vyplněn."); 
            if (original.isBlank())
                throw new ValidationException("Původní znění není vyplněno.");
            if (original.length() > 3) 
                throw new ValidationException("Původní znění musí být uvedeno jako zkratka (max 3 písmena).");
            if (dabings.isEmpty())
                throw new ValidationException("Film musí mít zadaný alespoň jeden dabing");
            if (production.isBlank()) 
                throw new ValidationException("Produkce musí být vyplněna");
            if (director == null)
                throw new ValidationException("Režisér musí být uveden.");
            if (genres.size() == 0) 
                throw new ValidationException("Žánr filmu musí být uveden.");
            if (time < 0)
                throw new ValidationException("Délka trvání snímku musí být kladné číslo.");
            if (time > 720)
                throw new ValidationException("Takto dlouhý film nám není povoleno vysílat.");
            if (pg < 3) 
                throw new ValidationException("Věkové omezení začíná od 3 let.");
            if (pg > 99)
                throw new ValidationException("Věkové omezení má maximální možnou hodnotu 99, ale od 18 to nedává smysl.");
            if (defaultCost < 0) 
                throw new ValidationException("Výchozí cena nemůže být záporná.");
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        }
    }
}
