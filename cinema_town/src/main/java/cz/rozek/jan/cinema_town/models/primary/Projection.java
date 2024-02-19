package cz.rozek.jan.cinema_town.models.primary;

import java.time.LocalDateTime;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
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
    private String title = "";
    // dabing
    @Size(max = 3)
    private String dabing = "";
    // datum kdy se bude film promítat
    @NotNull
    private LocalDateTime dateTime;

    public boolean intersect(Projection projection) {
        if (id.equals(projection.getId()))
            return false;

        if (hall.getId().equals(projection.getHall().getId())) {
            return !(
                dateTime.plusMinutes(film.getTime()).isBefore(projection.getDateTime()) ||
                projection.getDateTime().plusMinutes(projection.getFilm().getTime()).isBefore(dateTime)
            );
        } 
        
        return false;
    }

    @Override
    public void validate() throws ValidationException {
        if (hall == null) 
            throw new ValidationException("Sál musí být vybraný.");
        if (film == null) 
            throw new ValidationException("Film musí být vybraný.");
        if (cost < 0)
            throw new ValidationException("Nejmenší povolená cena je 0 Kč.");
        if (dateTime.isBefore(LocalDateTime.now().plusDays(1)))
            throw new ValidationException("Promítání musí být naplánováno alespoň 24 hodin předem."); 
        if (title == null || dabing == null) {
            throw new ValidationException("Textové parametry nemohou být null.");
        }
    }
}
