package cz.rozek.jan.cinema_town.controllers;

import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestParam;

import cz.rozek.jan.cinema_town.models.dtos.TokenDeviceId;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.UserRepository;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;
import cz.rozek.jan.cinema_town.servicies.emailSending.EmailService;

@org.springframework.web.bind.annotation.RestController
@CrossOrigin // TODO přidat restrikci
@RequestMapping(path = "/auth")
// TODO implementovat metody
public class AuthController {

    // definice konstanty, pod kterou bude očekávat v headru JWT
    protected static final String authorization = "authorization";
    // definice konstanty, pod kterou bude očekávat v headru id zařízení
    protected static final String deviceID = "deviceID";

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
        // TODO po dopsání metody register přidat catch výjimek
        try {

            // registruj uživatele a vystav mu aktivační kód
            String activationCode = authService.register(user);

            // pošly mu kód na email
            emailService.sendSimpleMessage(user.getEmail(), "Activation Code", "Your activation token is: " + activationCode);

            // vrať login JWT
            return new ResponseEntity<>(HttpStatus.OK);
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

            System.out.println(activationCode);

            // zkus ověřit
            String deviceID = authService.activateUser(activationCode);

            if (deviceID != null)
                return new ResponseEntity<>(deviceID, HttpStatus.OK);
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

            // pošly mu kód na email
            emailService.sendSimpleMessage(user.getEmail(), "Activation Code", "Your new activation token is: " + newActivationCode);

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
     * @param deviceID id zařízení, ze kterého se uživatel přihlašuje
     * @return pokud se uživatel přihlašuje ze známého zařízení varátí login JWT
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user, @RequestHeader Map<String, String> headers) {
        try {
            // přihlaš uživatele
            String jwt = authService.login(user, headers.get(deviceID));

            String identification = jwt.split("#")[0];

            String token = jwt.split("#")[1];

            // pokud se uživatele přihlašuje ze známého zařízení (metoda login vrátila
            // token) vrať login JWT
            if (identification.equals("login"))
                return new ResponseEntity<>(token, HttpStatus.OK);
            // pokud ne vrať status 100
            else {
                // TODO: poslat na email tento token
                emailService.sendSimpleMessage(user.getEmail(), "Second Verification", "Your access token is: " + token);
                return new ResponseEntity<>(HttpStatus.CONTINUE);
            }
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
     * Metoda pro zadání ověřovacího tokenu
     * 
     * @param headers           hlavička http requestu, která by měla obsahovat temp
     *                          JWT
     * @param verifycationToken token, který byl zaslán na email pro dvou fázové
     *                          ověření
     * @return pokud se uživatel prověří, ta vrátí login JWT
     */
    @PostMapping("/second-verify")
    public ResponseEntity<TokenDeviceId> secondVerify(@RequestBody String verifycationToken) {
        try {

            // ověř zda je i druhá fáze přihlášení provedena správně
            User user = authService.secondVerification(verifycationToken);

            // přidej uživateli id d;věryhodného zařízení
            String trustedDeviceID = authService.addDeviceIDToUser(user);

            // uživatele ulož
            userRepository.save(user);

            // přihlaš uživatele
            String loginJWT = authService.login(user, trustedDeviceID);

            return new ResponseEntity<>(new TokenDeviceId(loginJWT, trustedDeviceID), HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (SecurityException | NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro odebrání důvěryhodného zařízení
     */
    @PostMapping("/remove-device")
    public ResponseEntity<String> removeDevice(@RequestHeader Map<String, String> headers, @RequestBody String deviceId) {
        try {

            // získej si id uživatele
            String userID = authService.verifyLoginJWT(headers.get(authorization));

            User user = userRepository.findById(userID).get();

            boolean removed = user.getTrustedDevicesId().remove(deviceId);

            userRepository.save(user);

            if (removed)
                return new ResponseEntity<String>(HttpStatus.OK);
            else
                return new ResponseEntity<String>(HttpStatus.NOT_FOUND);

        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
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
    @PostMapping("/chande-pw")
    public ResponseEntity<String> chandePw(@RequestBody User user, @RequestHeader Map<String, String> headers) {
        // TODO dopsat vyjímky pro heslo, které neodpovídá požadavkům
        try {

            // ověř token
            String userID = authService.verifyLoginJWT(headers.get(authorization));

            // pokud jsou id stejná změň helo
            if (user.getId().equals(userID)) {

                // získej si uživatele z db
                User userFromDB = userRepository.findById(userID).get();
                // změň mu heslo
                userFromDB.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));

                // ulož změnu
                userRepository.save(userFromDB);

                return new ResponseEntity<String>(HttpStatus.OK);
            }

            return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro zažádání o reset hesla
     * pošle na email kód, který pošle uživatel spátky s novým heslem
     * TODO 
     */
    //@PostMapping("/forgotten-password/reset-code")
    
    /**
     * Metoda která resetuje heslo pokud ho užvatel nezná
     * TODO 
     */
    //@PostMapping("/forgotten_password/")

    /**
     * Metoda pro získání přístupového JWT
     */
    @GetMapping("/token")
    public ResponseEntity<String> getToken(@RequestHeader Map<String, String> headers) {
        try {
            return new ResponseEntity<>(authService.getAccessToken(headers.get(authorization)), HttpStatus.ACCEPTED);
        } catch (SecurityException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // TODO example remove

    @GetMapping("/sendEmail")
    public ResponseEntity<String> sendEmail(@RequestParam(name = "to") String to, @RequestParam(name = "subject") String subject, @RequestParam(name = "message") String message) {
        emailService.sendSimpleMessage(to, subject, message);
        return new ResponseEntity<String>("Message was send!", HttpStatus.OK);
    }
}
