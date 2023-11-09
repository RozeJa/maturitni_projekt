package cz.rozek.jan.cinema_town.models.stable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import java.util.List;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import cz.rozek.jan.cinema_town.models.Entity;
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
    @NotBlank
    @Indexed(unique = true)
    private String name;
    // popis děje filmu
    @NotBlank
    private String description;
    // adresa k filmu
    private String picture;
    // adresa k traileru na youtube
    private String trailer;
    // originání znění
    @NotBlank
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
}
