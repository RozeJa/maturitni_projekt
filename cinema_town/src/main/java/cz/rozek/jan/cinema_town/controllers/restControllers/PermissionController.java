package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.Permission;
import cz.rozek.jan.cinema_town.servicies.crudServicies.PermissionService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/permissions")
public class PermissionController extends cz.rozek.jan.cinema_town.controllers.RestController<Permission, PermissionService> {
    
}
