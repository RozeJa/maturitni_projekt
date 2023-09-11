package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.People;

public interface PeopleRepository extends MongoRepository<People, String> {
    
}
