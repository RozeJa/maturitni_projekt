package cz.rozek.jan.cinema_town.controllers.restControllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.primary.Hall;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
import cz.rozek.jan.cinema_town.servicies.crudServicies.HallService;

@RestController
@CrossOrigin(origins = {"https://www.mp.rozekja.fun", "*"})
@RequestMapping(path = "/api/halls")
public class HallController extends cz.rozek.jan.cinema_town.controllers.RestController<Hall, HallService> {
    

    @GetMapping("/unremovable/{cinemaID}")
    public ResponseEntity<String> getUnremovable(@PathVariable String cinemaID, @RequestHeader Map<String, String> headers) {
        try {

            List<Hall> entities = service.readAllUnremovable(cinemaID, headers.get(authorization));

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

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<String> delete(@PathVariable String id, @RequestHeader Map<String, String> headers) {
        return new ResponseEntity<String>(HttpStatus.METHOD_NOT_ALLOWED);
    }
}
