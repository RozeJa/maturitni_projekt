package cz.rozek.jan.cinema_town.models;
/**
 * Vyjímka je vyvolánam při kontrole validity nevalidní Entity
 */
public class ValidationException extends Exception {
    public ValidationException(String message) {
        super(message);
    }
}
