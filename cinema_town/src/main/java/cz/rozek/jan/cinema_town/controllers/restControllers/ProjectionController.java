package cz.rozek.jan.cinema_town.controllers.restControllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.repositories.ReservationRepository;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.crudServicies.ProjectionService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/projections")
public class ProjectionController extends cz.rozek.jan.cinema_town.controllers.RestController<Projection, ProjectionService> {
    
    @Autowired
    private EmailService emailService;
    @Autowired 
    private ReservationRepository reservationRepository;

    // Pro získání všech vrátit jen ty, které ještě neproběhly
    @Override
    @GetMapping("/")
    public ResponseEntity<String> getAll(Map<String, String> headers) {
        try {

            List<Projection> entities = service.readAll(headers.get(authorization));
            entities = entities.stream().filter(e -> e.getDateTime().isAfter(LocalDateTime.now())).toList();

            return new ResponseEntity<>(objectMapper.writeValueAsString(entities), HttpStatus.OK); 
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (AuthRequired e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/by/film/{filmId}")
    public ResponseEntity<String> getByFilmId(@PathVariable String filmId, @RequestHeader Map<String, String> headers) {
        try {

            List<Projection> entities = service.readByFilmId(filmId, headers.get(authorization));

            return new ResponseEntity<>(objectMapper.writeValueAsString(entities), HttpStatus.OK); 
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (AuthRequired e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/archived")
    public ResponseEntity<String> getArchived(Map<String, String> headers) {
        try {

            List<Projection> entities = service.readAll(headers.get(authorization));
            entities = entities.stream().filter(e -> e.getDateTime().isBefore(LocalDateTime.now())).toList();

            return new ResponseEntity<>(objectMapper.writeValueAsString(entities), HttpStatus.OK); 
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (AuthRequired e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO vytvořit prebuild pro lístek 
    // TODO zvalidovat, zda se ve vybraném sálu v zadaný čas probýhat promítání
    @Override
    @PostMapping("/")
    public ResponseEntity<String> post(@RequestBody Projection data, @RequestHeader Map<String, String> headers) {

        

        return super.post(data, headers);
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<String> put(@PathVariable String id, @RequestBody Projection data, @RequestHeader Map<String,String> headers) {
        try {
            ResponseEntity<String> response = super.put(id, data, headers);
    
            if (response.getStatusCode() == HttpStatus.OK) {
                // najdi si dané promítání 
                Projection p = service.readById(id, headers.get(authorization));
                // zjisti, kterých rezervací se změna týká
                List<Reservation> reservations = reservationRepository.findByProjection(p);
    
                // ty rezervace smaž
                reservationRepository.deleteAll(reservations);
    
                // upozorni uživatle na to, že jsi jim odebral rezervaci
                notifyUserOnRemoveReservation(reservations);
            }
    
            return response;
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id, @RequestHeader Map<String,String> headers) {
        try {
            Projection projection = service.readById(id, headers.get(authorization));

            ResponseEntity<String> response = super.delete(id, headers);

            if (response.getStatusCode() == HttpStatus.OK) {
                // najdi si dané promítání 
                Projection p = service.readById(id, headers.get(authorization));
                // zjisti, kterých rezervací se změna týká
                List<Reservation> reservations = reservationRepository.findByProjection(p);

                // ty rezervace smaž
                reservationRepository.deleteAll(reservations);

                // upozorni uživatle na to, že jsi jim odebral rezervaci, pokud se nejedná o promítání, které se už odehrálo
                if (LocalDateTime.now().compareTo(projection.getDateTime()) > 0) {
                    notifyUserOnCancledProjection(reservations);
                }
            }

            return response;            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private void notifyUserOnRemoveReservation(List<Reservation> reservations) {
        for (Reservation reservation : reservations) {
            emailService.sendSimpleMessage(reservation.getUser().getEmail(), "Reservation had to be cancelled", "We are very sorry, but there has been an unexpected change in the screening of the movie, " + reservation.getProjection().getFilm().getName() +", you made a reservation for. For this reason, we preferred to remove your reservation. We will be very happy if you decide to book a screening again. Thank you for your understanding.");
        }
    }

    private void notifyUserOnCancledProjection(List<Reservation> reservations) {
        for (Reservation reservation : reservations) {
            emailService.sendSimpleMessage(reservation.getUser().getEmail(), "Projection had to be cancelled", "We are very sorry, but we were unfortunately forced to cancel the screening of the film, " + reservation.getProjection().getFilm().getName() +", for which you made a reservation, thank you for your understanding.");
        }
    }
}
