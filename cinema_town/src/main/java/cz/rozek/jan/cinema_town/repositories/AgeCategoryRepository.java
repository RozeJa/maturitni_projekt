package cz.rozek.jan.cinema_town.repositories;

import cz.rozek.jan.cinema_town.models.stable.AgeCategory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AgeCategoryRepository extends MongoRepository<AgeCategory, String> {
    
}
