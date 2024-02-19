package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.primary.AgeCategory;

public interface AgeCategoryRepository extends MongoRepository<AgeCategory, String> {
    
}
