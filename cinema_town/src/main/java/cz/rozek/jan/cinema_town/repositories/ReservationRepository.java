package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.dynamic.Reservation;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByProjectionId(String id);
}
