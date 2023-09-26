package cz.rozek.jan.cinema_town.controllers.restControllers;

import java.util.List;
import java.util.Map;

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

import cz.rozek.jan.cinema_town.models.stable.Permission;
import cz.rozek.jan.cinema_town.servicies.crudServicies.PermissionService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/permissions")
public class PermissionController extends cz.rozek.jan.cinema_town.controllers.RestController<Permission, PermissionService> {
    // todo zkontrolovat zda nejde volat endointy

    @Override
    @GetMapping("/")
    public ResponseEntity<List<Permission>> getAll(@RequestHeader Map<String, String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<Permission> getOne(@PathVariable String id, @RequestHeader Map<String,String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }
    
    @Override
    @PostMapping("/")
    public ResponseEntity<Permission> post(@RequestBody Permission data, @RequestHeader Map<String,String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<Permission> put(@PathVariable String id, @RequestBody Permission data, @RequestHeader Map<String,String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }
    
    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Permission> delete(@PathVariable String id, @RequestHeader Map<String,String> headers) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }
}
