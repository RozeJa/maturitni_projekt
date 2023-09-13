package cz.rozek.jan.cinema_town.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.rozek.jan.cinema_town.servicies.auth.AuthService;
import cz.rozek.jan.cinema_town.servicies.crudServicies.UserService;

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
    @Autowired
    private UserService userService;

    /**
     * Metoda pro registraci 
     * @param user objekt představující nového uživatele
     * @return http responce s http statusem 100 a login JWT 
     */

    /**
     * Metoda pro aktivaci registrovenéhó účtu
     */

    /**
     * Metoda pro vygenerování nového aktivačního kódu 
     */

    /**
     * Metoda pro přidání dúvěryhodného zařízení
     */

    /**
     * Metoda pro odebrání důvěryhodného zařízení
     */

    /**
     * Metoda pro přihlášení
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
