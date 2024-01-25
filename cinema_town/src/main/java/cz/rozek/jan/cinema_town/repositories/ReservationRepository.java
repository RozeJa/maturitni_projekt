package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.models.stable.AgeCategory;
import cz.rozek.jan.cinema_town.models.stable.User;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByProjection(Projection id);
    List<Reservation> findByUser(User user);

    
    @Query("{ 'codes.values': ?0 }")
    List<Reservation> findByAgeCategory(AgeCategory ageCategory);
}
