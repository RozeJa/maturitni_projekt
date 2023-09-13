package cz.rozek.jan.cinema_town.servicies.auth;

public class AuthRequired extends RuntimeException {
    public AuthRequired(String message) {
        super(message);
    }
}
