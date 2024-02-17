package cz.rozek.jan.cinema_town.models.stable;

import java.util.List;
import java.util.regex.Pattern;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.models.ValidationException;
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
    @Indexed(unique = true)
    private String email = "";
    // heslo
    private String password = "";
    // heslo
    private String password2 = "";

    // zda byl účet aktivován
    private boolean active = false;

    // zda chce odebírat novinky 
    private boolean subscriber = false;

    // role, kterou uživatel má
    @NotNull
    @DBRef
    private Role role;

    // Token důvěry, jsou platné pokud nevyexpirovaly a pokud se nachází v této kolekci
    // private Set<String> trustToken = new TreeSet<String>();

    public boolean validateEmail() {
        Pattern emailReg = Pattern.compile("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

        return emailReg.matcher(email).matches();
    }

    public boolean validatePassword() {
        Pattern pwReg = Pattern.compile("^.*(?=.[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,}).*$");

        return pwReg.matcher(password).matches();
    }

    public List<String> loadPermissions() {
        return role.getPermissions()
        .values()
        .stream()
        .map(Permission::getPermission)
        .toList();
    }

    @Override
    public void validate() throws ValidationException {       
        try {
            if (!validateEmail()) 
                throw new ValidationException("Email není validní.");
            if (!validatePassword())
                throw new ValidationException("Heslo neodpovídá našim požadavkům.");
            if (role == null) 
                throw new ValidationException("Uživatel nemá přiřazenou roly.");
        } catch (NullPointerException e) {
            throw new ValidationException("Textové parametry nemohou být null.");
        } 
    }   
}
