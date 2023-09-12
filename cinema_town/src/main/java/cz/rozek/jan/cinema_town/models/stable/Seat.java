package cz.rozek.jan.cinema_town.models.stable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance představuje sedadlo 
@Document("seats")
@Data
@NoArgsConstructor
public class Seat implements Entity {
    
    @Id 
    private String id;

    // označení řady
    private String rowDesignation;
    // označení sadadla
    private int number;

    // index v řaďe
    private int rowIndex;
    // index ve sloupci 
    private int columnIndex;
}
