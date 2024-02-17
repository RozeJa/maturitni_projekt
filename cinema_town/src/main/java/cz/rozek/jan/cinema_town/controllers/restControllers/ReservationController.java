package cz.rozek.jan.cinema_town.controllers.restControllers;

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

import com.mongodb.DuplicateKeyException;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.dtos.ReservationDTO;
import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.crudServicies.ReservationService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailTemplate;
import cz.rozek.jan.cinema_town.servicies.paymentService.IPayment;
import cz.rozek.jan.cinema_town.servicies.pdfService.PdfService;

@RestController
@CrossOrigin(origins = {"https://www.mp.home-lab.rozekja.fun", "*"})
@RequestMapping(path = "/api/reservations")
public class ReservationController extends cz.rozek.jan.cinema_town.controllers.RestController<Reservation, ReservationService> {
    
    @Autowired
    private PdfService pdfService;
    @Autowired
    private EmailService emailService; 
    private final Map<String, IPayment> payments;

    @Autowired
    public ReservationController(Map<String, IPayment> payments) {
        this.payments = payments;
    }

    // Metoda slouží pro cenzurované načtení rezervací, na konkrétní promítání
    @GetMapping("/censured/{projectionId}")
    public ResponseEntity<List<Reservation>> getAllCensored(@PathVariable String projectionId) {
        try {
            List<Reservation> reservations = service.readCensored(projectionId);

            return new ResponseEntity<>(reservations, HttpStatus.OK);
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Override
    @PostMapping("/")
    public ResponseEntity<String> post(@RequestBody Reservation data, @RequestHeader Map<String, String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @PostMapping("/reservate")
    public ResponseEntity<String> reservate(@RequestBody ReservationDTO data, @RequestHeader Map<String,String> headers) {
        try {
            String accessJWT = headers.get(authorization);
    
            // ověř učivatele
            User user = service.verifyAccess(accessJWT, service.createPermissionRequired());
            
            // načtisi zpracování platby, které máš použít
            IPayment paymentMethod = payments.get(data.getPaymentData().get("type"));
    
            if (paymentMethod != null) {
                Reservation reservation = service.reservate(data, accessJWT);

                try {
                    paymentMethod.pay(reservation, data.getPaymentData(), accessJWT);

                    EmailTemplate et = emailService.loadTemplate("header-user-info");
                    et.replace("[@header]", "Rezervace sedadel na filmové představení " + reservation.getProjection().getFilm().getName());
                    et.replace("[@user]", reservation.getUser().getEmail());
                    et.replace("[@important-data]", "Budeme se na vás těšit.");
                    et.replace("[@info]", "Doufáme, že si představení užijete.");

                    emailService.sendEmail(user.getEmail(), "Vaše rezervace", et, pdfService.generatePdfTickets(reservation));
                } catch (Exception e) {
                    
                    service.delete(reservation.getId(), accessJWT);

                    e.printStackTrace();
                    throw new SecurityException("Payment was denite.");
                }
                return new ResponseEntity<>(HttpStatus.OK);
            }
            
            throw new ValidationException("Neplatný způsob platby.");
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (AuthRequired e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (ValidationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (DuplicateKeyException | org.springframework.dao.DuplicateKeyException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<String> put(@PathVariable String id, @RequestBody Reservation data, @RequestHeader Map<String, String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id, @RequestHeader Map<String,String> headers) {
        try {
            
            if (service.removeReservation(id, headers.get(authorization)))
                return new ResponseEntity<>(HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (AuthRequired e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
