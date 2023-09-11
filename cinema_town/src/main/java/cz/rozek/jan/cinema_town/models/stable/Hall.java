package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document("halls")
@Data
@NoArgsConstructor
public class Hall {
    
    @Id
    private String id;
    
    private String designation;
    
    private int rows;
    private int columns;

    private Map<String, Seat> seats = new HashMap<>();
}
