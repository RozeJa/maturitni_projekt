package cz.rozek.jan.cinema_town.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.rozek.jan.cinema_town.models.stable.Permission;

public interface PermissionRepository extends MongoRepository<Permission, String> {
    
}
