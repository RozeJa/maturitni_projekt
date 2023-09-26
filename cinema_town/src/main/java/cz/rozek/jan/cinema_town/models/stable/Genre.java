package cz.rozek.jan.cinema_town.models.stable;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance představuje žánr
@Document("genres")
@Data
@NoArgsConstructor
public class Genre implements Entity {
    
    @Id 
    private String id;

    // název žánru 
    @NotBlank
    private String name;
}
