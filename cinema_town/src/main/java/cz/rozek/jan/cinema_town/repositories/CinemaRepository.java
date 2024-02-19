package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cz.rozek.jan.cinema_town.models.primary.Cinema;

public interface CinemaRepository extends MongoRepository<Cinema, String> {
    List<Cinema> findByCityId(String cityId);

    @Query("{ 'halls.?0' : { $exists : true } }")
    Cinema findByHall(String hallId);
}
