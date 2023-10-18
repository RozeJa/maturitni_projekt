package cz.rozek.jan.cinema_town.models.stable;

import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Pattern;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
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
    @Indexed(unique = true)
    private String email;
    // heslo
    @NotBlank
    private String password;

    // zda byl účet aktivován
    private boolean active = false;

    // zda chce odebírat novinky 
    private boolean subscriber = false;

    // role, kterou uživatel má
    @NotNull
    @DBRef
    private Role role;

    private Set<String> trustedDevicesId = new TreeSet<>();

    public boolean validateEmail() {
        Pattern emailReg = Pattern.compile("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

        return emailReg.matcher(email).matches();
    }

    public List<String> loadPermissions() {
        return role.getPermissions()
        .values()
        .stream()
        .map(Permission::getPermission)
        .toList();
    }
}
