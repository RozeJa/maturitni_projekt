package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.Role;
import cz.rozek.jan.cinema_town.servicies.crudServicies.RoleService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/roles")
public class RoleController extends cz.rozek.jan.cinema_town.controllers.RestController<Role, RoleService> {
    
}
