package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import javax.validation.constraints.Min;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
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
    @Min(1)
    private int rows;
    // počet sloupců
    @Min(1)
    private int columns;

    // sedadla v sálu mapování id => sedadlo
    @DBRef
    private Map<String, Seat> seats = new HashMap<>();

    @Override
    public void validate() throws ValidationException {

        if (designation == null)
            throw new ValidationException("Designation cant be null.");
        if (designation.isBlank())
            throw new ValidationException("Designation cant be empty.");
        if (rows < 1) 
            throw new ValidationException("Number of rows must be at least 1.");
        if (columns < 1) 
            throw new ValidationException("Number of columns must be at least 1.");
        if (seats.size() == 0) 
            throw new ValidationException("Seats cant be null");
    }
}
