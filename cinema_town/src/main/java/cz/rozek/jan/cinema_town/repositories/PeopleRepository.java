package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cz.rozek.jan.cinema_town.models.primary.People;

public interface PeopleRepository extends MongoRepository<People, String> {

    @Query("{ 'name': ?0, 'surname': ?1 }")
    People findByNameAndSurname(String name, String surname);
}
