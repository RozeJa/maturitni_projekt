package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import org.hibernate.validator.constraints.NotBlank;
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

    // název města, ve kterém se kino nachází
    @NotBlank
    private String city;
    // poštovní směrovaní číslo
    @NotBlank
    private String postCode;
    // název ulice, z které je vstup do kina
    @NotBlank
    private String street;
    // číslo popisné 
    @NotBlank
    private String houseNumber;

    // seznam sálů kina; mapování id => sál
    @DBRef
    private Map<String, Hall> halls = new HashMap<>();
}
