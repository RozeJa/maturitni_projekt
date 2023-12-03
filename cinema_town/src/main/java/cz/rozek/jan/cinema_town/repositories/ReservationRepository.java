package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.models.stable.User;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByProjection(Projection id);
    List<Reservation> findByUser(User user);
}
