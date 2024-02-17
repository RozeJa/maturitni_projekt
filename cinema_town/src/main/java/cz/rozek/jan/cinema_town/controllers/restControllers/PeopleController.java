package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.People;
import cz.rozek.jan.cinema_town.servicies.crudServicies.PeopleService;

@RestController
@CrossOrigin(origins = {"https://www.mp.home-lab.rozekja.fun", "*"})
@RequestMapping(path = "/api/people")
public class PeopleController extends cz.rozek.jan.cinema_town.controllers.RestController<People, PeopleService> {

}
