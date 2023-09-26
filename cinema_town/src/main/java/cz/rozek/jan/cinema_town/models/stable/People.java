package cz.rozek.jan.cinema_town.models.stable;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance slouží pro uchování jména a příjmení herce nego režiséra
@Document("people")
@Data
@NoArgsConstructor
public class People implements Entity {
    
    @Id
    private String id;

    // jméno
    @NotBlank
    private String name;
    // přijmení    
    @NotBlank
    private String surname;

}
