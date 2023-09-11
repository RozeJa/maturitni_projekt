package cz.rozek.jan.cinema_town.models.stable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document("fimls")
@Data
@NoArgsConstructor
public class Film {
    
    @Id
    private String id;

    private String name;
    private String description;
    private String picture;
    private String trailer;
    private String original;

    @DBRef
    private People direcror;
    @DBRef
    private Map<String, People> actors = new HashMap<>();
    @DBRef
    private Map<String, Genre> genres = new HashMap<>();

    private List<String> titles = new ArrayList<>();
    private List<String> dabings = new ArrayList<>();
    
    private int time;
    private int pg;
    private double cost;
    
    private LocalDate production;
    private LocalDate premier;
}
