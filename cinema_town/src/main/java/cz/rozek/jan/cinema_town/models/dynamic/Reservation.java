package cz.rozek.jan.cinema_town.models.dynamic;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.stable.Seat;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance reprezentuje jednu rezervaci určitého promítání.
@Document("reservations")
@Data
@NoArgsConstructor
public class Reservation implements Entity {
    
    @Id
    private String id;

    // promítání, ke kterénu je reervace vztahuje
    @DBRef
    private Projection projection;
    // rezervované sedadlo
    @DBRef
    private Seat seat;
    // proměná signalizuje, zda je rezervace zaplacena
    private boolean paid = false;
    // čas, kdy byla rezervace zadána do systému
    private LocalDateTime reserved = LocalDateTime.now();
}  
