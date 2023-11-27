package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.models.stable.Hall;

public interface ProjectionRepository extends MongoRepository<Projection, String> {
    List<Projection> findByFilm(Film film);
    List<Projection> findByHall(Hall hall);
}
