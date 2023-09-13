package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.servicies.crudServicies.FilmService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/films")
public class FilmController extends cz.rozek.jan.cinema_town.controllers.RestController<Film, FilmService> {
    
}
