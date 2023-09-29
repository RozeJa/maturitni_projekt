package cz.rozek.jan.cinema_town.controllers.restControllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.servicies.crudServicies.UserService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/users")
public class UserController extends cz.rozek.jan.cinema_town.controllers.RestController<User, UserService> {
    
    @Override
    @PutMapping("/{id}")
    public ResponseEntity<String> put(@PathVariable String id, @RequestBody User data, @RequestHeader Map<String,String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }
}
