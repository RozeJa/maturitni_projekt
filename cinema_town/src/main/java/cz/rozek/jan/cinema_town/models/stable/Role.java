package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document("roles")
@Data
@NoArgsConstructor
public class Role {
    
    @Id
    private String id;

    private String name;

    @DBRef
    private Map<String, Permition> permissions = new HashMap<>();

    public boolean containsPermition(String requiredPermition) {
        for (Permition p : permissions.values()) {
            if (p.getPermition().equals(requiredPermition)) {
                return true;
            }
        }

        return false;
    }
}
