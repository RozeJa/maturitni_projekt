package cz.rozek.jan.cinema_town.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.servicies.auth.AuthService;

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
    // služba pro práci s uživateli

    /**
     * Metoda pro registraci 
     * @param user objekt představující nového uživatele
     * @return http responce s http statusem 100 a login JWT 
     */
    @PostMapping("/register") 
    public ResponseEntity<String> register(@RequestBody User user) {
        // TODO po dopsání metody register přidat catch výjimek
        try {

            // registruj uživatele a vystav mu token
            String registerJWT = authService.register(user);

            // vrať login JWT
            return new ResponseEntity<>(registerJWT, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Metoda pro aktivaci registrovenéhó účtu
     * @param activationCode aktivační kód pro neaktivovaný účet
     * @param headers hlavička http requestu, která by měla obsahovat login JWT
     * @return http responce s id zařízení, které bude příjmané jako důvěryhodné 
     */
    @PostMapping("/activate-account")
    public ResponseEntity<String> activate(@RequestBody String activationCode, @RequestHeader Map<String, String> headers) {
        try {
            // zkus ověřit
            String deviceID = authService.activateUser(headers.get(authorization), activationCode);

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
     * @param headers hlavička http requestu, která by měla obsahovat login JWT
     * @return http responce
     */
    @PostMapping("/reset-activation-code")
    public ResponseEntity<String> resetActivationCode(@RequestHeader Map<String, String> headers) {
        try {
            if (authService.resetActivationCode(headers.get(authorization))) 
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
     * @param user objekt uživatele, s přihlašovacím jménem a heslem
     * @param deviceID id zařízení, ze kterého se uživatel přihlašuje 
     * @return pokud se uživatel přihlašuje ze známého zařízení varátí login JWT
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user, @RequestHeader Map<String, String> headers) {
        try {
            // přihlaš uživatele 
            String loginJWT = authService.login(user, headers.get(deviceID));
            
            // pokud se uživatele přihlašuje ze známého zařízení (metoda login vrátila token) vrať login JWT 
            if (loginJWT != null) 
                return new ResponseEntity<>(loginJWT, HttpStatus.OK);
            // pokud ne vrať status 100
             else 
                return new ResponseEntity<>(HttpStatus.CONTINUE);
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
     * @param headers hlavička http requestu, která by měla obsahovat login JWT
     * @param verifycationToken token, který byl zaslán na email pro dvou fázové ověření
     * @return pokud se uživatel 
     */

    /**
     * Metoda pro odebrání důvěryhodného zařízení
     */


    /**
     * Metoda pro odhlášení
     */

    /**
     * Metoda pro změnu hesla
     */

    /**
     * Metoda pro získání přístupového JWT
     */
}
