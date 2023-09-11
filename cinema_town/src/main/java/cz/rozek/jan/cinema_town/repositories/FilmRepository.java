package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.Film;

public interface FilmRepository extends MongoRepository<Film, String> {
    
}
