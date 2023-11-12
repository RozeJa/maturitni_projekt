package cz.rozek.jan.cinema_town.models;

public interface Entity {  
    String getId();
    void setId(String id);

    void validate() throws ValidationException;
}
