package cz.rozek.jan.cinema_town.models.stable;

import javax.validation.constraints.Min;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance představuje sedadlo 
@Document("seats")
@Data
@NoArgsConstructor
public class Seat implements Entity {
    
    @Id 
    private String id;

    // označení řady
    private String rowDesignation = "";
    // označení sadadla
    @Min(0)
    private int number;
    // index v řaďe
    @Min(0)
    private int rowIndex;
    // index ve sloupci 
    @Min(0)
    private int columnIndex;
    // označení, zda se jedná o sedadlo nebo ne
    // možná upravit
    private boolean seat = true;

    @Override
    public void validate() throws ValidationException {
        try {
            if (rowDesignation.isBlank())
                throw new ValidationException("Sedadlo musí mít vyplnění označení řady.");
            if (number <= 0) 
                throw new ValidationException("Pořadí sedadla musí být větší 0.");
            if (rowIndex < 0) 
                throw new ValidationException("Nejmenší očíslování řady je 0.");
            if (columnIndex < 0) 
                throw new ValidationException("Nejmenší očíslování sloupce je 0.");
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        } 
    }
}
