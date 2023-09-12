package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.Seat;

public interface SeatRepository extends MongoRepository<Seat, String> {
    
}