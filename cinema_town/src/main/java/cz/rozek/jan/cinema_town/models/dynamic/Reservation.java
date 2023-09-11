package cz.rozek.jan.cinema_town.models.dynamic;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.stable.Seat;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("reservations")
@Data
@NoArgsConstructor
public class Reservation {
    
    @Id
    private String id;

    @DBRef
    private Projection projection;
    @DBRef
    private Seat seat;
    private boolean paid;
    private LocalDateTime reserved = LocalDateTime.now();
}  
