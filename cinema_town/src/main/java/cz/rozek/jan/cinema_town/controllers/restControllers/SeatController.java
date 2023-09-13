package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.servicies.crudServicies.SeatService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/seats")
public class SeatController extends cz.rozek.jan.cinema_town.controllers.RestController<Seat, SeatService> {
    
}
