package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cz.rozek.jan.cinema_town.models.primary.AgeCategory;
import cz.rozek.jan.cinema_town.models.primary.Projection;
import cz.rozek.jan.cinema_town.models.primary.Reservation;
import cz.rozek.jan.cinema_town.models.primary.Seat;
import cz.rozek.jan.cinema_town.models.primary.User;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByProjection(Projection id);
    List<Reservation> findByUser(User user);

    
    @Query("{ 'codes.values': ?0 }")
    List<Reservation> findByAgeCategory(AgeCategory ageCategory);

    @Query("{ 'projection.id': ?0.id, 'seats': { $elemMatch: { $in: ?1 } } }")
    List<Reservation> findByProjectionIdAndSeats(Projection projection, List<Seat> seats);
    @Query("{ 'user.id': ?0.id }")
    List<Reservation> findByUserId(User user);
    @Query("{ 'seats.id': ?0 }")
    List<Reservation> findBySeat(String seatId);
}
