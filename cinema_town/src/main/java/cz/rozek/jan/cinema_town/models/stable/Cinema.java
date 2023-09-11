package cz.rozek.jan.cinema_town.models.stable;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document("cinemas")
@Data
@NoArgsConstructor
public class Cinema {

    @Id
    private String id;

    private String city;
    private String postCode;
    private String street;
    private String houseNumber;

    @DBRef
    private Map<String, Hall> halls = new HashMap<>();
}
