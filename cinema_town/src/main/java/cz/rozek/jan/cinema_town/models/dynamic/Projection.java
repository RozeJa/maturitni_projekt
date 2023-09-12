package cz.rozek.jan.cinema_town.models.dynamic;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.models.stable.Hall;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance reprezentuje jedno konkrétní promítání daného filmu v určitý čas.
@Document("projections")
@Data
@NoArgsConstructor
public class Projection implements Entity {
    
    @Id
    private String id;

    // sál, ve kterém se promítání uskuteční
    @DBRef
    private Hall hall;
    // film, který se bude promítat
    @DBRef
    private Film film;
    // titulky
    private String title;
    // dabing
    private String dabing;
    // datum kdy se bude film promítat
    private LocalDate date;
    // čas, kdy se bude fiml promítat
    private LocalTime time;
}
