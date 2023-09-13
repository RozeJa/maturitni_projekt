package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance představuje uživatele
@Document("users")
@Data
@NoArgsConstructor
public class User implements Entity {
    
    @Id
    private String id;

    // email
    private String email;
    // heslo
    private String password;

    // zda byl účet aktivován
    private boolean active;

    // role, kterou uživatel má
    @DBRef
    private Role role;
    // rezervace uživatele maované ip => rezervace
    @DBRef
    private Map<String, Reservation> reservations = new HashMap<>();

    private Set<String> trustedDevicesId = new TreeSet<>();
}
