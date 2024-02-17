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
    private String designation = "";
    
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
        try {
            if (designation.isBlank())
                throw new ValidationException("Označení sálu není vyplněno.");
            if (rows < 1) 
                throw new ValidationException("Sál musí mít alespoň dvě řady sedadel.");
            if (columns < 1) 
                throw new ValidationException("Sál musí mít alespoň dva sloupce sedadel.");
            if (seats.size() != rows * columns) 
                throw new ValidationException("Násobek počtu řad a sloupců musí být shodný s počtem sedadel.");
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        }
    }
}
