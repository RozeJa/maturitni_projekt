package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;

public interface ProjectionRepository extends MongoRepository<Projection, String> {
    
}
