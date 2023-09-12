package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance předtanuje sál
@Document("halls")
@Data
@NoArgsConstructor
public class Hall implements Entity {
    
    @Id
    private String id;
    
    // označení sálu
    private String designation;
    
    // počet řad
    private int rows;
    // počet sloupců
    private int columns;

    // sedadla v sálu mapování id => sedadlo
    private Map<String, Seat> seats = new HashMap<>();
}
