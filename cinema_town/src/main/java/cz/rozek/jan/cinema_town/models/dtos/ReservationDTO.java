package cz.rozek.jan.cinema_town.models.dtos;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.models.stable.Seat;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReservationDTO {
    // tato proměná se k ničemu nepoužije, slouží pouze pro umožnení konverze mezi frontendem a backendem 
    private String id = "";
    // objekt promítání
    private Projection projection;
    // sedadla, o která má uživatel zájem
    private List<Seat> seats = new ArrayList<>();;
    // informece, k uskutečnění platby
    private Map<String, String> paymentData = new HashMap<>();
    // seznam věkových kategorií, o které má uživatel zájem celkový součet lístků jednotlivých kategoriích musí být roven počtu sedadel
    private Map<String, Integer> agesCategories = new HashMap<>();

    public boolean isValid() {
        int ticketsCount = agesCategories.values().stream().mapToInt(Integer::intValue).sum();
        
        return ticketsCount == seats.size();
    }
}

