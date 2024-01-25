package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cz.rozek.jan.cinema_town.models.stable.Cinema;
import cz.rozek.jan.cinema_town.models.stable.Hall;

public interface CinemaRepository extends MongoRepository<Cinema, String> {
    List<Cinema> findByCityId(String cityId);

    @Query("{ 'halls.values': ?0 }")
    Cinema findByHall(Hall hall);
}
