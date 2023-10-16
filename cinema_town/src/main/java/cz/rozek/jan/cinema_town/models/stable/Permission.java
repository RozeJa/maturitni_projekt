package cz.rozek.jan.cinema_town.models.stable;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import cz.rozek.jan.cinema_town.models.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

// Instance představuje oprávnění 
// pokud role obsahuje oprávnění je uživatel oprávněn k provedení činnosti, která toto oprávnění vyžaduje 
@Document("permissions")
@Data
@NoArgsConstructor
public class Permission implements Entity {
    
    @Id
    private String id;

    // název oprávnění
    @NotBlank
    @Indexed(unique = true)
    private String permission;
}
