package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.Film;

public interface FilmRepository extends MongoRepository<Film, String> {
  /*List<Film> findByDirectorId(String id);
    List<Film> findByActorsId(String id);

    List<Film> findByGenresId(String id);
    */
}
