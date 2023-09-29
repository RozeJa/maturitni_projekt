package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.servicies.crudServicies.ReservationService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/reservations")
public class ReservationController extends cz.rozek.jan.cinema_town.controllers.RestController<Reservation, ReservationService> {
    
    // TODO když bude rezervace zaplacena pošli uživateli "lístky"
    @Autowired
    private EmailService emailService;          
}
