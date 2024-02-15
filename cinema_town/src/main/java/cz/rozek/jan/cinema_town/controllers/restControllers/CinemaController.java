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
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailTemplate;

@RestController
@CrossOrigin(origins = {"https://www.mp.home-lab.rozekja.fun", "http://localhost", "*"}) // TODO odebrat divoukou kartu
@RequestMapping(path = "/api/cinemas")
public class CinemaController extends cz.rozek.jan.cinema_town.controllers.RestController<Cinema, CinemaService> {
    
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;

    @Override
    @PostMapping("/")
    public ResponseEntity<String> post(@RequestBody Cinema data, @RequestHeader Map<String,String> headers) {
        try {
            ResponseEntity<String> response = super.post(data, headers);

            if (response.getStatusCode() == HttpStatus.OK) {
                // získej si odběratele 
                List<User> subs = userRepository.findAll().stream().filter(User::isSubscriber).toList();
                // upozorni odběratele na to, že přibylo nové kino
                notifySubs(subs, data);
            }

            return response;            
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private void notifySubs(List<User> subs, Cinema cinema) {
        EmailTemplate et = emailService.loadTemplate("notification");

        et.replace("[@header]", "Otevíráme pro vás nové multikino");
        et.replace("[@text-1]", "Těšíme se na vaši návštěvu v novém multikině, které najdete na adrese");
        et.replace("[@text-bold]", cinema.getCity().getName() + " " + cinema.getStreet() + " " + cinema.getHouseNumber());
        et.replace("[@text-2]", ". Rádi vás tu uvidíme.");

        for (User sub : subs) {
            emailService.sendEmail(sub.getEmail(), "Nové multikino ve městě " + cinema.getCity().getName(), et);
        }
    }
}
