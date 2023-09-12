package cz.rozek.jan.cinema_town.models.stable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

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
    private String name;
    // popis děje filmu
    private String description;
    // adresa k filmu
    private String picture;
    // adresa k traileru na youtube
    private String trailer;
    // originání znění
    private String original;

    // režisér
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
    private int time;
    // věková hranice
    private int pg;
    // cena lístku
    private double cost;
    
    // datum kdy byl film vypuštěn
    private LocalDate production;
    // den premiéry 
    private LocalDate premier;
}
