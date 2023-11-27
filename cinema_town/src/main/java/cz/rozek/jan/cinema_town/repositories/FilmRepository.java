package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.models.stable.Genre;
import cz.rozek.jan.cinema_town.models.stable.People;

public interface FilmRepository extends MongoRepository<Film, String> {

  // TODO ! FUNGUJE??
  List<Film> findByDirector(People people);
  List<Film> findByActors(People people);

  List<Film> findByGenres(Genre genre); 
}
