package cz.rozek.jan.cinema_town.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenDeviceId {
    private String loginToken;
    private String trustToken;
}
