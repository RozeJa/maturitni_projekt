package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.Cinema;
import cz.rozek.jan.cinema_town.servicies.crudServicies.CinemaService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/cinemas")
public class CinemaController extends cz.rozek.jan.cinema_town.controllers.RestController<Cinema, CinemaService> {
    
}
