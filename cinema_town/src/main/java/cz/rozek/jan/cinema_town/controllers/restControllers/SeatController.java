package cz.rozek.jan.cinema_town.controllers.restControllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.servicies.crudServicies.SeatService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/seats")
public class SeatController extends cz.rozek.jan.cinema_town.controllers.RestController<Seat, SeatService> {
    
    @Override
    @PostMapping("/")
    public ResponseEntity<Seat> post(@RequestBody Seat data, @RequestHeader Map<String,String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }
}
