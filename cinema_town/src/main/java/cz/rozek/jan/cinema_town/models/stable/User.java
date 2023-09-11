package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("users")
@Data
@NoArgsConstructor
public class User {
    
    @Id
    private String id;

    private String email;
    private String password;

    private String activationToken;
    private boolean active;

    @DBRef
    private Role role;
    @DBRef
    private Map<String, Reservation> reservations = new HashMap<>();
}
