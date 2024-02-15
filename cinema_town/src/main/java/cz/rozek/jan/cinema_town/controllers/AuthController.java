package cz.rozek.jan.cinema_town.controllers;

import java.io.NotActiveException;
import java.util.Map;
import java.util.NoSuchElementException;

import org.jose4j.lang.JoseException;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mongodb.DuplicateKeyException;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.dtos.TokenDeviceId;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.UserRepository;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;
import cz.rozek.jan.cinema_town.servicies.auth.SecurityException;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailTemplate;

@org.springframework.web.bind.annotation.RestController
@CrossOrigin(origins = {"https://www.mp.home-lab.rozekja.fun", "http://localhost"})
@RequestMapping(path = "/auth")
public class AuthController {

    // definice konstanty, pod kterou bude očekávat v headru JWT
    protected static final String authorization = "authorization";
    // definice konstanty, pod kterou bude očekávat v headru id zařízení
    protected static final String trustToken = "trust-token";

    // složba pro ověření oprávnění
    @Autowired
    private AuthService authService;
    // repozitář pro přístup k uživatelúm
    private UserRepository userRepository;
    
    // služba pro odesílání emailů
    @Autowired
    private EmailService emailService;

    // metoda pro vložení závislosti na UserRepository
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Metoda pro registraci
     * 
     * @param user objekt představující nového uživatele
     * @return http responce s http statusem 100 a login JWT
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {

            // registruj uživatele a vystav mu aktivační kód
            String activationCode = authService.register(user);

            // načti si template a vyplňho daty
            EmailTemplate et = emailService.loadTemplate("header-user-info");
            et.replace("[@header]", "Aktivujte svůj účet");
            et.replace("[@user]", user.getEmail());
            et.replace("[@important-data]", activationCode);
            et.replace("[@info]", "Pokud jste se u nás neregistrovali, tak se omlouváme za obtěžování, ale někdo se pokusil založit účet na váš email.");

            // pošly mu kód na email
            emailService.sendEmail(user.getEmail(), "Aktivační kód", et);

            // vrať login JWT
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DuplicateKeyException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (SecurityException | org.springframework.dao.DuplicateKeyException | ValidationException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro aktivaci registrovenéhó účtu
     * 
     * @param activationCode aktivační kód pro neaktivovaný účet
     * @param headers        hlavička http requestu, která by měla obsahovat login
     *                       JWT
     * @return http responce s id zařízení, které bude příjmané jako důvěryhodné
     */
    @PostMapping("/activate-account")
    public ResponseEntity<String> activate(@RequestBody String activationCode) {
        try {

            // zkus ověřit
            String trustToken = authService.activateUser(activationCode.split("=")[0]);

            if (trustToken != null)
                return new ResponseEntity<>(trustToken, HttpStatus.OK);
            else
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro vygenerování nového aktivačního kódu
     * 
     * @param headers hlavička http requestu, která by měla obsahovat login JWT
     * @return http responce
     */
    @PostMapping("/reset-activation-code")
    public ResponseEntity<String> resetActivationCode(@RequestBody User user) {
        try {

            String newActivationCode = authService.resetActivationCode(user);

            // načti si template a vyplňho daty
            EmailTemplate et = emailService.loadTemplate("header-user-info");
            et.replace("[@header]", "Aktivujte svůj účet");
            et.replace("[@user]", user.getEmail());
            et.replace("[@important-data]", newActivationCode);
            et.replace("[@info]", "Pokud jste se u nás neregistrovali, tak se omlouváme za obtěžování, ale někdo se pokusil založit účet na váš email.");

            // pošly mu kód na email
            emailService.sendEmail(user.getEmail(), "Náhradní aktivační kód", et);

            if (!newActivationCode.isEmpty())
                return new ResponseEntity<>(HttpStatus.OK);
            else
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro přihlášení
     * 
     * @param user     objekt uživatele, s přihlašovacím jménem a heslem
     * @param trustToken id zařízení, ze kterého se uživatel přihlašuje
     * @return pokud se uživatel přihlašuje ze známého zařízení varátí login JWT
     */
    @PostMapping("/login")
    public ResponseEntity<TokenDeviceId> login(@RequestBody User user, @RequestHeader Map<String, String> headers) {
        try {
            // přihlaš uživatele
            String jwt = authService.login(user, headers.get(trustToken), false);

            String identification = jwt.split("#")[0];

            String token = jwt.split("#")[1];

            // pokud se uživatele přihlašuje ze známého zařízení (metoda login vrátila
            // token) vrať login JWT
            if (identification.equals("login")) {
                TokenDeviceId tokenDeviceId = new TokenDeviceId();
                tokenDeviceId.setLoginToken(token);
                tokenDeviceId.setTrustToken(authService.generateTrustToken(user));

                return new ResponseEntity<>(tokenDeviceId, HttpStatus.OK);
            // pokud ne vrať status 100
            } else {
                    
                // načti si template a vyplňho daty
                EmailTemplate et = emailService.loadTemplate("header-user-info");
                et.replace("[@header]", "Dvoufázové ověření");
                et.replace("[@user]", user.getEmail());
                et.replace("[@important-data]", token);
                et.replace("[@info]", "Jelikož se přihlašujete na neznámém zařízení, je potřeba, abyste se prokázali tímto kódem.");

                // pošly mu kód na email
                emailService.sendEmail(user.getEmail(), "Dvoufázové ověření", et);
                
                return new ResponseEntity<>(null, HttpStatus.ACCEPTED);
            }
        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (NotActiveException e) {
            resetActivationCode(user);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (SecurityException | JoseException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro zadání ověřovacího tokenu
     * 
     * @param headers           hlavička http requestu, která by měla obsahovat temp
     *                          JWT
     * @param verifycationToken token, který byl zaslán na email pro dvou fázové
     *                          ověření
     * @return pokud se uživatel prověří, ta vrátí login JWT
     */
    @PostMapping("/second-verify")
    public ResponseEntity<TokenDeviceId> secondVerify(@RequestBody String verificationToken) {
        try {

            // ověř zda je i druhá fáze přihlášení provedena správně
            User user = authService.secondVerification(verificationToken.split("=")[0]);

            // vygeneruj pro uživatele token pro dvoufázové ověřen
            String trustToken = authService.generateTrustToken(user);

            // přihlaš uživatele
            String loginJWT = authService.login(user, trustToken, true).split("#")[1];

            return new ResponseEntity<>(new TokenDeviceId(loginJWT, trustToken), HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (SecurityException | NullPointerException | NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro odhlášení
     */
    @PostMapping("/logoff")
    public ResponseEntity<String> logoff(@RequestHeader Map<String, String> headers) {
        try {
            authService.logout(headers.get(authorization));

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro změnu hesla
     */
    @PostMapping("/change-pw")
    public ResponseEntity<String> chandePw(@RequestBody User user, @RequestHeader Map<String, String> headers) {
        try {

            // ověř token
            String userID = authService.verifyLoginJWT(headers.get(authorization));

            // pokud jsou id stejná změň helo
            if (user.getId().equals(userID) && authService.verifyUserLogin(user)) {

                // získej si uživatele z db
                User userFromDB = userRepository.findById(userID).get();

                userFromDB.setPassword(user.getPassword2());
                
                // zvaliduj uživatele
                userFromDB.validate();

                // změň mu heslo
                userFromDB.setPassword(BCrypt.hashpw(user.getPassword2(), BCrypt.gensalt()));

                // ulož změnu
                userRepository.save(userFromDB);
                return new ResponseEntity<>("", HttpStatus.OK);
            } 

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (ValidationException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro zažádání o reset hesla
     * pošle na email kód, který pošle uživatel spátky s novým heslem
     */
    @PostMapping("/forgotten-password/reset-code")
    public ResponseEntity<String> generateReserCode(@RequestBody User user) {
        try {
            String resetCode = authService.makePWResetCode(user);

            // načti si template a vyplňho daty
            EmailTemplate et = emailService.loadTemplate("header-user-info");
            et.replace("[@header]","Kód pro reset hesla.");
            et.replace("[@user]", user.getEmail());
            et.replace("[@important-data]", resetCode);
            et.replace("[@info]", "Někdo požádal o změnu vaše ho hesla. Pokud jste to nebyly Vy, tak se ujistěte, že máte tuto emailovou schránku pevně pod kontrolou.");
            
            // pošly mu kód na email
            emailService.sendEmail(user.getEmail(), "Obnova hesla", et);

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (SecurityException | NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Metoda která resetuje heslo pokud ho užvatel nezná
     */
    @PostMapping("/forgotten_password/")
    public ResponseEntity<TokenDeviceId> resetPassword(@RequestBody User user) {
        try {

            String loginToken = authService.resetPassword(user);
            String trustToken = authService.generateTrustToken(user);

            return new ResponseEntity<>(new TokenDeviceId(loginToken, trustToken), HttpStatus.OK);
        } catch (ValidationException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (SecurityException | NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Metoda pro získání přístupového JWT
     */
    @GetMapping("/token")
    public ResponseEntity<String> getToken(@RequestHeader Map<String, String> headers) {
        try {
            return new ResponseEntity<>(authService.getAccessToken(headers.get(authorization)), HttpStatus.OK);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
