package cz.rozek.jan.cinema_town.models.dynamic;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import javax.validation.ValidationException;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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
    @NotNull
    @DBRef
    private Hall hall;
    // film, který se bude promítat
    @NotNull
    @DBRef
    private Film film;
    // cena lístku
    @Min(0)
    private double cost;
    // titulky
    @Size(max = 3)
    private String title;
    // dabing
    @Size(max = 3)
    private String dabing;
    // datum kdy se bude film promítat
    @NotNull
    private LocalDateTime dateTime;

    @Override
    public void validate() throws ValidationException {
        if (hall == null) 
            throw new ValidationException("Hall cant be null.");
        if (film == null) 
            throw new ValidationException("Film cant be null.");
        if (cost < 0)
            throw new ValidationException("Minila cost is '0'.");
        if (dateTime.isBefore(LocalDateTime.now()))
            throw new ValidationException("Date of projection must be today or after today."); 
    }
}
