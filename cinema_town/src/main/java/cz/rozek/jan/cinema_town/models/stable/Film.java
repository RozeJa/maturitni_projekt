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
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance představuje film
@Document("fimls")
@Data
@NoArgsConstructor
public class Film implements Entity {
    
    @Id
    private String id;

    // název filmu
    @NotBlank
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

    // režisér
    @NotNull
    @DBRef
    private People direcror;
    // herci mapovaní id => herec
    @DBRef
    private Map<String, People> actors = new HashMap<>();
    // žánry mapování id =>žánr
    @DBRef
    private Map<String, Genre> genres = new HashMap<>();

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
    // cena lístku
    @Min(0)
    private double cost;
    
    // datum kdy byl film vypuštěn
    @NotNull
    private LocalDate production;
    // den premiéry 
    @NotNull
    private LocalDate premier;
}
