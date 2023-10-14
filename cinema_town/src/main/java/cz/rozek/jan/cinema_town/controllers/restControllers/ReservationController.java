package cz.rozek.jan.cinema_town.controllers.restControllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.servicies.crudServicies.ReservationService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/reservations")
public class ReservationController extends cz.rozek.jan.cinema_town.controllers.RestController<Reservation, ReservationService> {
    
    @Autowired
    private EmailService emailService; 
    
    // TODO když bude rezervace zaplacena | budou rezervace zaplaceny, přijde uživateli email se vstupenkami
    @Override
    @PostMapping("/")
    public ResponseEntity<String> post(@RequestBody Reservation data, @RequestHeader Map<String, String> headers) {
        // TODO Auto-generated method stub
        return super.post(data, headers);
    }

    @PostMapping("multiple/")
    public ResponseEntity<String> postMultiple(@RequestBody List<Reservation> data, @RequestHeader Map<String,String> headers) {
        // TODO
        return null;
    }

    // TODO když bude rezervace zaplacena pošli uživateli "lístky"
    @Override
    @PutMapping("/{id}")
    public ResponseEntity<String> put(@PathVariable String id, @RequestBody Reservation data, @RequestHeader Map<String, String> headers) {
        // TODO Auto-generated method stub
        return super.put(id, data, headers);
    }

    @PutMapping("multiple/{id}")
    public ResponseEntity<String> putMultiple(@PathVariable String id, List<Reservation> data, Map<String, String> headers) {
        // TODO
        return null;
    }
}
