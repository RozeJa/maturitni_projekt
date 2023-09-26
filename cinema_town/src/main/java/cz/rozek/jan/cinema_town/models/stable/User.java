package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
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
    @NotBlank
    @Email
    private String email;
    // heslo
    @NotBlank
    private String password;

    // zda byl účet aktivován
    private boolean active = false;

    // role, kterou uživatel má
    @NotNull
    @DBRef
    private Role role;
    // rezervace uživatele maované ip => rezervace
    @NotNull
    @DBRef
    private Map<String, Reservation> reservations = new HashMap<>();

    private Set<String> trustedDevicesId = new TreeSet<>();
}
