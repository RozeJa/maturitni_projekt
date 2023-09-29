package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;

public interface ProjectionRepository extends MongoRepository<Projection, String> {
    List<Projection> findByFilmId(String id);
}
