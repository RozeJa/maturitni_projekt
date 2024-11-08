package cz.rozek.jan.cinema_town.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.primary.Role;
import cz.rozek.jan.cinema_town.models.primary.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    List<User> findAllByRole(Role role);
}
