package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
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
    private String street;
    // číslo popisné 
    private String houseNumber;

    // seznam sálů kina; mapování id => sál
    @DBRef
    private Map<String, Hall> halls = new HashMap<>();
}
