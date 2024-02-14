package cz.rozek.jan.cinema_town.models.dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ResetPWCode {
    private LocalDateTime lastRequest = LocalDateTime.now();
    private int requestLatency;
    private LocalDateTime firstAcceptedTime;
    private int frequency = 1;

    private String code;

    public ResetPWCode(int requestLatency, String code) {
        this.code = code;
        this.requestLatency = requestLatency;
        setUpAcceptableTime();
    }

    public boolean isFrequencyGood() {
        return firstAcceptedTime.isBefore(LocalDateTime.now());
    }

    public void increaseFactor() {
        frequency++;
        requestLatency = frequency * requestLatency;
        setUpAcceptableTime();
    }

    public void resetFactor() {
        frequency = 1;
        setUpAcceptableTime();
    }

    private void setUpAcceptableTime() {
        setFirstAcceptedTime(LocalDateTime.now().plusMinutes(requestLatency));
    }

    public boolean compareCodes(String code) {
        return this.code.equals(code);
    }
}
