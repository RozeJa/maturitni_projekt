package cz.rozek.jan.cinema_town.models.dynamic;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.models.stable.Hall;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("projections")
@Data
@NoArgsConstructor
public class Projection {
    
    @Id
    private String id;

    @DBRef
    private Hall hall;
    @DBRef
    private Film film;
    private LocalDate date;
    private LocalTime time;
}
