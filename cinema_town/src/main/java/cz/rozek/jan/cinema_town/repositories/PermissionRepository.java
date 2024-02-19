package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.primary.Permission;

public interface PermissionRepository extends MongoRepository<Permission, String> {
    
}
