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

import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.UserRepository;
import cz.rozek.jan.cinema_town.servicies.crudServicies.FilmService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/films")
public class FilmController extends cz.rozek.jan.cinema_town.controllers.RestController<Film, FilmService> {
    
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;

    @Override 
    @PostMapping("/")
    public ResponseEntity<String> post(@RequestBody Film data, @RequestHeader Map<String,String> headers) {
        ResponseEntity<String> response = super.post(data, headers);

        if (response.getStatusCode() == HttpStatus.OK) {
            // najdi si odběratele
            List<User> subs = userRepository.findAll().stream().filter(User::isSubscriber).toList();

            notifySubs(subs, data);
        }

        return response;
    }

    // TODO nahrávání fotky filmu

    private void notifySubs(List<User> subs, Film film) {
        for (User sub : subs) {
            emailService.sendSimpleMessage(sub.getEmail(), "New Film: " + film.getName(), "Hello we are introducing new film, " + film.getName() + ", at " + film.getPremier() + " in yours cinemas.");
        }
    }
}
