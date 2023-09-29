package cz.rozek.jan.cinema_town.controllers.restControllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.stable.Cinema;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.UserRepository;
import cz.rozek.jan.cinema_town.servicies.crudServicies.CinemaService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/cinemas")
public class CinemaController extends cz.rozek.jan.cinema_town.controllers.RestController<Cinema, CinemaService> {
    
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;

    @Override
    @PostMapping("/")
    public ResponseEntity<String> post(@RequestBody Cinema data, @RequestHeader Map<String,String> headers) {
        ResponseEntity<String> response = super.post(data, headers);

        if (response.getStatusCode() == HttpStatus.OK) {
            // získej si odběratele 
            List<User> subs = userRepository.findAll().stream().filter(User::isSubscriber).toList();
            // upozorni odběratele na to, že přibylo nové kino
            notifySubs(subs, data);
        }

        return response;
    }

    private void notifySubs(List<User> subs, Cinema cinema) {
        for (User sub : subs) {
            emailService.sendSimpleMessage(sub.getEmail(), "New Cinema in " + cinema.getCity(), "Hello, we are openind new cinema for you in " + cinema.getCity() + " " + cinema.getStreet() + " " + cinema.getHouseNumber() + ".");
        }
    }
}
