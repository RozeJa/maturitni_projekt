package cz.rozek.jan.cinema_town.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import cz.rozek.jan.cinema_town.models.Entity;
import cz.rozek.jan.cinema_town.servicies.CrudService;
import cz.rozek.jan.cinema_town.servicies.auth.SecurityException;

// abstraktní, defautní implementace resr controlleru 
// ve třídě jsou definované metody pro obsloužení základních http requestů
// pokud bude třeba metodu přepsat, tak nad anotaci @Override je třeba doplnit i mapování
// pokud dojde k přidávání dalších endpointů bude potřeba pro ně využít jiné mapování než "/" příp "/{id}" s vyjímkou přepisování stávajících metod
public abstract class RestController<E extends Entity, S extends CrudService<E,?>> {
    
    // definice konstanty, pod kterou bude očekávat v headru JWT
    protected static final String authorization = "authorization";

    // spužba pro práci s daty
    @Autowired
    protected S service;

    /**
     * metoda rest api pro získání všech záznamů
     * @param headers hlačička http requestu 
     * @return // TODO
     */
    @GetMapping("/")
    public ResponseEntity<List<E>> getAll(@RequestHeader Map<String, String> headers) {
        try {

            List<E> entities = service.readAll(headers.get(authorization));

            if (entities.isEmpty())
                throw new NullPointerException();

            return new ResponseEntity<>(entities, HttpStatus.OK);
        } catch (NullPointerException e) {
            return new ResponseEntity<List<E>>(HttpStatus.NOT_FOUND);
        } catch (SecurityException e) {
            return new ResponseEntity<List<E>>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<List<E>>(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } 

    /**
     * metoda rest api pro získání konkrétního záznamů
     * @param id id záznamu, který chce vrátit
     * @param headers hlačička http requestu 
     * @return // TODO
     */
    @GetMapping("/{id}")
    public ResponseEntity<E> getOne(@PathVariable String id, @RequestHeader Map<String,String> headers) {
        try {

            E entity = service.readById(id, headers.get(authorization));

            if (entity == null)
                throw new NullPointerException();

            return new ResponseEntity<>(entity, HttpStatus.OK);
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    /**
     * metoda rest api pro vytvoření záznamu
     * @param data záznam, který má být přidán do db
     * @param headers hlačička http requestu 
     * @return // TODO
     */
    @PostMapping("/")
    public ResponseEntity<E> post(@RequestBody E data, @RequestHeader Map<String,String> headers) {
        try {
        
            E saved = service.create(data, headers.get(authorization));

            return new ResponseEntity<>(saved, HttpStatus.OK);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * metoda rest api pro editaci záznamu
     * @param id id záznamu, který má být editován
     * @param data instance obsahující editovaná data
     * @param headers hlačička http requestu 
     * @return // TODO
     */
    @PutMapping("/{id}")
    public ResponseEntity<E> put(@PathVariable String id, @RequestBody E data, @RequestHeader Map<String,String> headers) {
        try {

            E updated = service.update(id, data, headers.get(authorization));

            if (updated == null)
                throw new NullPointerException();

            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * metoda rest api pro smazání záznamu
     * @param id id záznamu, který má být odstraněn
     * @param headers hlačička http requestu 
     * @return // TODO
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<E> delete(@PathVariable String id, @RequestHeader Map<String,String> headers) {
        try {

            boolean deleted = service.delete(id, headers.get(authorization));

            if (deleted) 
                return new ResponseEntity<>(HttpStatus.OK);
            else 
                throw new NullPointerException();   
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
