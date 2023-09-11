package cz.rozek.jan.cinema_town.models.stable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document("permitions")
@Data
@NoArgsConstructor
public class Permition {
    
    @Id
    private String id;

    private String permition;
}
