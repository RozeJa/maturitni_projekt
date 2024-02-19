package cz.rozek.jan.cinema_town.controllers.restControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.rozek.jan.cinema_town.models.primary.AgeCategory;
import cz.rozek.jan.cinema_town.servicies.crudServicies.AgeCategoryService;

@RestController
@CrossOrigin(origins = {"https://www.mp.home-lab.rozekja.fun", "*"})
@RequestMapping(path = "/api/age_categories")
public class AgeCategoryController extends cz.rozek.jan.cinema_town.controllers.RestController<AgeCategory, AgeCategoryService> {
    
}
