package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.City;

public interface CityRepository extends MongoRepository<City, String> {
    City findByName(String name);
}
