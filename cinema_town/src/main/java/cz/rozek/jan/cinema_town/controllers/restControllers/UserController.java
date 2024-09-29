package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.primary.User;
import cz.rozek.jan.cinema_town.servicies.crudServicies.UserService;

@RestController
@CrossOrigin(origins = {"https://www.mp.rozekja.fun", "*"})
@RequestMapping(path = "/api/users")
public class UserController extends cz.rozek.jan.cinema_town.controllers.RestController<User, UserService> {
    
}
