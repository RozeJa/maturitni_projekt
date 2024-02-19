package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.primary.Genre;
import cz.rozek.jan.cinema_town.servicies.crudServicies.GenreService;

@RestController
@CrossOrigin(origins = {"https://www.mp.home-lab.rozekja.fun", "*"})
@RequestMapping(path = "/api/genres")
public class GenreController extends cz.rozek.jan.cinema_town.controllers.RestController<Genre, GenreService> {
    
}
