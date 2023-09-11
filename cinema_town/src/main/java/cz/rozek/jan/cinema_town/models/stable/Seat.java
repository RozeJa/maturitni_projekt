package cz.rozek.jan.cinema_town.models.stable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document("seats")
@Data
@NoArgsConstructor
public class Seat {
    
    @Id 
    private String id;

    private String rowDesignation;
    private int number;

    private int rowIndex;
    private int columnIndex;
}
