package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.List;
import java.util.HashMap;
import java.util.stream.Collectors;

import javax.validation.ValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.dtos.ReservationDTO;
import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.models.stable.AgeCategory;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.ProjectionRepository;
import cz.rozek.jan.cinema_town.repositories.ReservationRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

@Service
public class ReservationService extends CrudService<Reservation, ReservationRepository> {

    @Autowired
    private ProjectionRepository projectionRepository;
    @Autowired 
    private AgeCategoryService ageCategoryService;
    
    @Autowired
    @Override
    public void setRepository(ReservationRepository repository) {
        this.repository = repository;
    }
    @Autowired
    @Override
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public String readPermissionRequired() {
        return "reservation-read";
    }
    @Override
    public String createPermissionRequired() {
        return "reservation-create";
    }
    @Override
    public String updatePermissionRequired() {
        return "reservation-update";
    }
    @Override
    public String deletePermissionRequired() {
        return "reservation-delete";
    }

    @Override
    public List<Reservation> readAll(String accessJWT) {
        List<Reservation> reservations = super.readAll(accessJWT);

        User user = verifyAccess(accessJWT, readPermissionRequired());

        if (user.getRole().getName().equals("admin")) {
            return reservations;
        } else {
            return reservations.stream().filter(r -> r.getUser().getId().equals(user.getId())).toList();
        }
    }

    public List<Reservation> readCensored(String projectionId) {
        Projection p = projectionRepository.findById(projectionId).get();

        List<Reservation> reservations = repository.findByProjection(p);

        return reservations.stream()
            .map(r -> {
                r.setCodes(new HashMap<>());
                r.setUser(null);
                r.setReserved(null);
                return r;
            })
            .collect(Collectors.toList());
    }

    @Override
    public Reservation readById(String id, String accessJWT) {
        
        User user = verifyAccess(accessJWT, readPermissionRequired());

        Reservation r = super.readById(id, accessJWT);

        if (r.getUser().getId().equals(user.getId()) | user.getRole().getName().equals("admin")) {

            return r;
        }

        throw new SecurityException("Access denied");
    }

    public Reservation reservate(ReservationDTO reservationDTO, String accessJWT) {

        // ověř učivatele
        User user = verifyAccess(accessJWT, createPermissionRequired());

        // validuj rezervaci
        if (!reservationDTO.isValid())
            throw new ValidationException("Reservation count of seats have to equal tickets count.");

        // vytvoř objekt rezervace a vyplň ho daty
        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setProjection(reservationDTO.getProjection());
        reservation.setSeats(reservationDTO.getSeats());

        // načti si věkové kategorie
        List<AgeCategory> ageCategories = ageCategoryService.readAll(accessJWT);
        
        for (String acId : reservationDTO.getAgesCategories().keySet()) {
            // pokud enexistuje vyhodí nosuchelement exception
            AgeCategory ac = ageCategories.stream().filter(acdc -> acdc.getId().equals(acId)).findFirst().get();

            
        }

        return reservation;
    }    
}
