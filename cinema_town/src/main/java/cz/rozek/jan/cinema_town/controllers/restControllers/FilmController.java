package cz.rozek.jan.cinema_town.controllers.restControllers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.imaging.ImageReadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import cz.rozek.jan.cinema_town.helpers.ImageTypeValidator;
import cz.rozek.jan.cinema_town.models.stable.Film;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.UserRepository;
import cz.rozek.jan.cinema_town.servicies.auth.AuthRequired;
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

    @PostMapping("/store-img")
    public ResponseEntity<String> uploadFile(@RequestPart("file") MultipartFile file, @RequestParam("picture") String picture, @RequestParam("film") String filmID, @RequestHeader Map<String,String> headers) {
        try {            

            // zkontroluj přístup 
           service.verifyAccess(headers.get(authorization), service.updatePermissionRequired());

            // získej obrázek
            byte[] data = getImg(file);
    
            if (data != null) {
                
                // pokud složka neexistuje vytvoř ji
                File dir = new File("./frontend/src/assets/imgs/films-imgs/" + filmID);
                dir.mkdirs();
                
                // TODO uložit
                // Nejprve ulož nový a pokud se ve složce nachází ještě něco, tak to smaž
                File imgFile = new File(dir.getAbsolutePath() + File.separator + picture);
                try (FileOutputStream stream = new FileOutputStream(imgFile)) {
                    stream.write(file.getBytes());
                }

                removeOldFile(dir, imgFile.getName());

                // Vrácení odpovědi klientovi
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (SecurityException | AuthRequired e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (ImageReadException | IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void removeOldFile(File dir, String actual) throws Exception {
        String[] files = dir.list();

        for (String file : files) {
            if (!file.equals(actual)) {
                File toRemove = new File(dir.getAbsolutePath() + File.separator + file);
                toRemove.delete();
            }
        }
    }

    private byte[] getImg(MultipartFile file) throws Exception {
        
        byte[] data = file.getBytes();
        
        String fileSuffix = ImageTypeValidator.getImageType(data);
        String[] enableSuffix = {
            "image/jpg",
            "image/jpeg",
            "image/png"
        };

        for (String suffix : enableSuffix) {
            if (fileSuffix.equals(suffix)) {
                return data;
            }
        }

        return null;
    }

    private void notifySubs(List<User> subs, Film film) {
        for (User sub : subs) {
            emailService.sendSimpleMessage(sub.getEmail(), "New Film: " + film.getName(), "Hello we are introducing new film, " + film.getName() + ", at " + film.getPremier() + " in yours cinemas.");
        } 
    }
}
