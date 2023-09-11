package cz.rozek.jan.cinema_town.models.stable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document("genres")
@Data
@NoArgsConstructor
public class Genre {
    
    @Id 
    private String id;

    private String name;
}
