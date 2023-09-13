package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.Hall;
import cz.rozek.jan.cinema_town.servicies.crudServicies.HallService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/halls")
public class HallController extends cz.rozek.jan.cinema_town.controllers.RestController<Hall, HallService> {
    
}
