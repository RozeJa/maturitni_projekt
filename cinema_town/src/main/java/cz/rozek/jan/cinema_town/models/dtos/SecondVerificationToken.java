package cz.rozek.jan.cinema_town.models.dtos;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SecondVerificationToken {
    private String userID;
    private LocalDateTime expiration;
    private int minutesToExpire;

    public boolean isExpired() {

        LocalDateTime now = LocalDateTime.now();

        int yearDifference = now.getYear() - expiration.getYear();
        int monthDifference = now.getMonthValue() - expiration.getMonthValue();
        int dayDifference = now.getDayOfMonth() - expiration.getDayOfMonth();
        int hourDifference = now.getHour() - expiration.getHour();
        int minuteDifference = now.getMinute() - expiration.getMinute();

        return yearDifference != 0 || monthDifference != 0 && dayDifference != 0 && hourDifference != 0 && minuteDifference > 10;
    }
}
