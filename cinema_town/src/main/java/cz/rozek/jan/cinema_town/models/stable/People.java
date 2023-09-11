package cz.rozek.jan.cinema_town.models.stable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document("people")
@Data
@NoArgsConstructor
public class People {
    
    @Id
    private String id;

    private String name;
    private String surname;
    
}
