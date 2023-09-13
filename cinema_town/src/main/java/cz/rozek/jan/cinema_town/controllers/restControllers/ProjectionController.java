package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.dynamic.Projection;
import cz.rozek.jan.cinema_town.servicies.crudServicies.ProjectionService;

@RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/api/projections")
public class ProjectionController extends cz.rozek.jan.cinema_town.controllers.RestController<Projection, ProjectionService> {
    
}
