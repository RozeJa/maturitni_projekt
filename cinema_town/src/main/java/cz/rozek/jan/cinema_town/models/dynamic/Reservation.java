package cz.rozek.jan.cinema_town.models.dynamic;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.models.stable.AgeCategory;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance reprezentuje jednu rezervaci určitého promítání.
@Document("reservations")
@Data
@NoArgsConstructor
public class Reservation implements Entity {
    
    @Id
    private String id;

    // promítání, ke kterénu je reervace vztahuje
    @NotNull
    @DBRef
    private Projection projection;
    // uživatel, který provedl rezervaci
    @NotNull
    @DBRef
    private User user;
    // rezervované sedadlo
    @NotNull
    @DBRef
    private List<Seat> seats;
    // kód pro identifikaci vstupenek
    private Map<String, AgeCategory> codes = new HashMap<>();
    // čas, kdy byla rezervace zadána do systému
    @NotNull
    private LocalDateTime reserved = LocalDateTime.now();


    public Double countPrice() {
        double price = 0;
        for (AgeCategory ac : getCodes().values()) {
            price += Math.round(ac.getPriceModificator() * getProjection().getCost());
        }
        return price;
    }

    @Override
    public void validate() throws ValidationException {
        if (projection == null)
            throw new ValidationException("Projection cant be null.");
        if (user == null)
            throw new ValidationException("User cant be null.");
        if (seats.isEmpty()) 
            throw new ValidationException("Seats cant be empty.");
    }
}  
