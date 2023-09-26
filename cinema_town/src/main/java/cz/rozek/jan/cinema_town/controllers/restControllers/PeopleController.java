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

import cz.rozek.jan.cinema_town.models.stable.People;
import cz.rozek.jan.cinema_town.servicies.crudServicies.PeopleService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/people")
public class PeopleController extends cz.rozek.jan.cinema_town.controllers.RestController<People, PeopleService> {
    
    
    @Override
    @PostMapping("/")
    public ResponseEntity<People> post(@RequestBody People data, @RequestHeader Map<String,String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

}
