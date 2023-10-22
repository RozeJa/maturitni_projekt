package cz.rozek.jan.cinema_town.models.stable;

import javax.validation.constraints.Min;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
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
    @NotBlank
    private String designation;
    
    // počet řad
    @Min(1)
    private int rows;
    // počet sloupců
    @Min(1)
    private int columns;

    // sedadla v sálu mapování id => sedadlo
    @DBRef
    private Seat[][] seats;
}
