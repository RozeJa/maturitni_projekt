package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.Role;

public interface RoleRepository extends MongoRepository<Role, String> {
    
}
