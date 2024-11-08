package cz.rozek.jan.cinema_town.servicies.crudServicies;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.dtos.ReservationDTO;
import cz.rozek.jan.cinema_town.models.primary.AgeCategory;
import cz.rozek.jan.cinema_town.models.primary.Projection;
import cz.rozek.jan.cinema_town.models.primary.Reservation;
import cz.rozek.jan.cinema_town.models.primary.User;
import cz.rozek.jan.cinema_town.repositories.ProjectionRepository;
import cz.rozek.jan.cinema_town.repositories.ReservationRepository;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;
import cz.rozek.jan.cinema_town.servicies.auth.RandomStringGenerator;

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

        // ověř oprávnění
        User user = verifyAccess(accessJWT, readPermissionRequired());

        // načti záznamy
        List<Reservation> entities = repository.findByUser(user);
        return entities.stream().filter(r -> !r.isRemoved()).toList();
    }

    public List<Reservation> readCensored(String projectionId) {
        Projection p = projectionRepository.findById(projectionId).get();

        List<Reservation> reservations = repository.findByProjection(p);

        return reservations.stream()
            .filter(r -> !r.isRemoved())
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

    @Override
    public boolean delete(String id, String accessJWT) {

        Reservation reservation = repository.findById(id).get();

        if (!reservation.isRemoved()) {
            reservation.setRemoved(true);

            repository.save(reservation);
            return true;
        }

        return false;
    }

    public boolean removeReservation(String id, String accessJWT) {
        
        Reservation reservation = repository.findById(id).get();

        if (reservation.canRemove()) {
            return delete(id, accessJWT);
        } 
        
        return false;
    }

    public Reservation reservate(ReservationDTO reservationDTO, String accessJWT) throws ValidationException {

        // ověř učivatele
        User user = verifyAccess(accessJWT, createPermissionRequired());

        // validuj rezervaci
        reservationDTO.isValid();
        
        // vytvoř objekt rezervace a vyplň ho daty
        Reservation reservation = buildReservationFormDTO(reservationDTO, user, accessJWT);

        // ověř zda místo už nemá nikdo rezervované
        List<Reservation> reserved = repository.findByProjectionIdAndSeats(reservation.getProjection(), reservation.getSeats());
        if (!reserved.isEmpty()) 
            throw new ValidationException("Sedadla jiš byla zarezervována.");

        // pokud nemá ulož rezervaci 
        reservation = repository.save(reservation);

        return reservation;
    }

    private Reservation buildReservationFormDTO(ReservationDTO dto, User user, String accessJWT) {
        
        // vytvoř objekt rezervace a vyplň ho daty
        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setProjection(dto.getProjection());
        reservation.setSeats(dto.getSeats());

        // načti si věkové kategorie
        List<AgeCategory> ageCategories = ageCategoryService.readAll(accessJWT);
        Map<String, AgeCategory> codes = new HashMap<>();
        
        for (String acId : dto.getAgesCategories().keySet()) {
            if (dto.getAgesCategories().get(acId) != 0) {
                // pokud enexistuje vyhodí nosuchelement exception
                AgeCategory ac = ageCategories.stream().filter(acdc -> acdc.getId().equals(acId)).findFirst().get();
                for (int i = 0; i < dto.getAgesCategories().get(acId); i++) {
                    insertCategoryUnderCode(ac, codes);   
                }
            }
        }

        reservation.setCodes(codes);
        
        return reservation;
    }

    private void insertCategoryUnderCode(AgeCategory ageCategory, Map<String, AgeCategory> codes) {
        boolean inserted = false;

        while (!inserted) {
            String code = RandomStringGenerator.generateRandomString(inserted, 10);
            
            if (codes.get(code) == null) {
                codes.put(code, ageCategory);
                inserted = true;
            }
        }
    }
}
