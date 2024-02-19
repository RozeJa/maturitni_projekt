package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cz.rozek.jan.cinema_town.models.primary.Film;
import cz.rozek.jan.cinema_town.models.primary.Hall;
import cz.rozek.jan.cinema_town.models.primary.Projection;

public interface ProjectionRepository extends MongoRepository<Projection, String> {
    List<Projection> findByFilm(Film film);
    List<Projection> findByHall(Hall hall);
    @Query("{'hall':  ($in : ? 0)}")
    List<Projection> findByHall(List<Hall> halls);
}
