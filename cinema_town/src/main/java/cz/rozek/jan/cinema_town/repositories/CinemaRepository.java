package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.Cinema;

public interface CinemaRepository extends MongoRepository<Cinema, String> {
    List<Cinema> findByCityName(String cityName);
}
