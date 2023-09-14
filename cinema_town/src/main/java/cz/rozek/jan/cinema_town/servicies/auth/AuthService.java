package cz.rozek.jan.cinema_town.servicies.auth;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.jose4j.jwa.AlgorithmConstraints.ConstraintType;
import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.lang.JoseException;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.UserRepository;

// třída poskytuje služby pro přihlášení, odhlášení a ověření přístupových práv
@Service
public class AuthService {

    // klíč používaný k ověřování pravosti JWT, který se loužívá při registraci
    private RsaJsonWebKey rsaTempTokenKey;
    // klíč používaný k ověřování pravosti JWT, který se používá pro login
    private RsaJsonWebKey rsaLoginTokenKey;
    // klíč používaný k ověřování pravosti JWT, který se používá jako přístupový
    private RsaJsonWebKey rsaAccessTokenKey;

    // kdo je vydavatel JWT
    private static final String ISSUER = "CinemaTown";
    // pro koho je vydáván JWT
    private static final String AUDIENCE = "CinemaTown";

    // množina vydaných a aktivních JWT, používaných pro login
    private Set<String> loggedIn = new HashSet<>();
    // množina vydaných a aktivních JWT, používaných pro registraci
    private Set<String> registered = new HashSet<>();

    // mapa kde jsou pod aktivačnímy kódy mapováni neaktivovaní uživatelé
    private Map<String, User> inactiveUsers = new HashMap<>();
    // mapa uživatelů, kteří čekají na zadání druhé fáze přihlášení
    // mapa je ve stylu userID => token
    private Map<String, String> secondVerification = new HashMap<>();

    // repozitář pro přístup k uživatelúm
    private UserRepository userRepository;

    // metoda pro vložení závislosti na UserRepository
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthService() {
        try {
            // vygenerování klíče pro registraci
            rsaTempTokenKey = RsaJwkGenerator.generateJwk(2048);
            rsaTempTokenKey.setKeyId("register-key");

            // vygenerování klíče pro login
            rsaLoginTokenKey = RsaJwkGenerator.generateJwk(2048);
            rsaLoginTokenKey.setKeyId("login-key");

            // vygenerování klíče pro přístup
            rsaAccessTokenKey = RsaJwkGenerator.generateJwk(2048);
            rsaAccessTokenKey.setKeyId("access-key");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Metoda pro aktivaci uživatelského účtu
     * 
     * @param tempJWT dočasný JWT
     * @param activationCode kód pro oktivaci uživatele
     * @return vrátí true pokud uživatel byl aktivován. V opačném řípadě vrátí
     *         false.
     * @throws SecurityException k vyvolání výjimky dojde když by byl loginToken
     *                           podvržený, nebo neplatný
     */
    public String activateUser(String tempJWT, String activationCode) throws SecurityException {
        // zjisti zda pod aktivačním kódem někoho máš
        User expectedUser = inactiveUsers.get(activationCode);
        if (expectedUser != null) {

            String userID = verifyJWT(tempJWT, rsaTempTokenKey, registered);

            // pokud jo prověř zda je to stejný uživatel
            if (expectedUser.getId().equals(userID)) {
                // pokud je, aktivuj ho
                expectedUser.setActive(true);

                // přidej uživateli id důvěryhodného zařízení
                String deviceID = addDeviceIDToUser(expectedUser);

                // ulož změny
                userRepository.save(expectedUser);

                // odeber aktivovaného uživatele z mapy pro neaktivované
                inactiveUsers.remove(activationCode);

                return deviceID;
            }
        }

        // když buť pod kódem nikoho nemáš, nebo pokud se uživatel neshoduje vtať null
        return null;
    }

    /**
     * Metoda pro vygenerování jiného aktivačního kódu
     * 
     * @param tempJWT
     * @return vrátí true pokud změnil aktivační kód
     * @throws SecurityException k vyvolání výjimky dojde když by byl loginToken podvržený, nebo neplatný
     */
    public boolean resetActivationCode(String tempJWT) throws SecurityException {
        // získej si z login tokenu id uživate, který o reser žádá
        String userID = verifyJWT(tempJWT, rsaTempTokenKey, registered);

        // pokud účet ještě není aktivovaný, vygeneruj nový token 
        // TODO prověď kontrolu

        String oldActivationCode = "";
        String newActivationCode = "";
        User user = null;
        for (String activationCode : inactiveUsers.keySet()) {
            if (inactiveUsers.get(activationCode).getId().equals(userID)) {
                // TODO vygeneruj nový kód
                newActivationCode = null; // TODO;
                oldActivationCode = activationCode;
                user = inactiveUsers.get(activationCode);

                break;
            }
        }
        
        // pokud uživatel není v kolekci 
        if (user == null) {
            // TODO vygeneruj kód a přidej ho do kolekce 

            // pokud jsi vygeneroval nový kód, tak ho vyměň s novým
        } else if (!oldActivationCode.equals("")) {

            // TODO pošly email s navým aktivačním kódem

            inactiveUsers.remove(oldActivationCode);
            inactiveUsers.put(newActivationCode, user);
            return true;
        }

        return false;
    }

    /**
     * Metoda zaregistruje uživatele do systému
     * @param user // nový uživatel
     * @return objekt, reprezentující uživatele, i s id
     */
    public String register(User user) {
        // TODO implementovat metodu, která registruj uživatele
        // zvaliduj email
        // zvaliduj passphrase

        // změň heslo na hash

        // pokud takový uživatel neexistuje přidej ho do db

        // vygeneruj pro něj jednorázový aktivační kód

        // pošly mu kód na email

        return null;
    }

    /**
     * metoda pro přihlášení uživatele
     * 
     * @param user uživatel
     * @return login JWT
     * @throws SecurityException výjimka je vyvolány při nesprávném hesle
     * @throws JoseException     nastala chyba při vytváření tokenu
     */
    public String login(User user, String deviceID) throws SecurityException, JoseException {
        // najdi uživatele v db podle emailu
        User userFromDB = userRepository.findByEmail(user.getEmail());

        // pokud uživatel neexistuje vyvolej NullPointerException
        if (userFromDB == null)
            throw new NullPointerException();

        // pokud uživatel existuje použij BCrypt k ověření hesla
        if (BCrypt.checkpw(user.getPassword(), userFromDB.getPassword())) {

            // uživatel se přihásil správně zkontroluj, zda se přihlašuje ze známého
            // zařízení
            if (userFromDB.getTrustedDevicesId().contains(deviceID)) {

                // heslo je správné => vytvoř token
                String jwt = generateLoginJWT(userFromDB);
                // přidej do množiny přihlášených ten token
                loggedIn.add(jwt);
                // vrať login JWT
                return "login#" + jwt;

                // uživatel se nepřihlašuje, ze známého zařízení
            } else {
                // vygeneruj přístupový token
                String token = RandomStringGenerator.generateRandomString("");

                // přidej do mapy pro druhé ověření pod id uživatele token
                secondVerification.put(userFromDB.getId(), token);

                // TODO: poslat na email tento token

                // vygeneruj dočasný JWT
                String jwt = generateTempJWT(userFromDB);

                return "temp#" + jwt;
            }
        } else
            // heslo není správné vyvolej SecurityException
            throw new SecurityException("Password isn´t right.");
    }

    /**
     * metoda vrátí přístupový JWT pokud login JWT je přihlášený
     * 
     * @param loginJWT JWT používaný pro login
     * @return přístupový JWT
     * @throws SecurityException k vyvolání výjimky dojde pokud login JWT není
     *                           validní, nebo není přihlášen
     */
    public String getAccessToken(String loginJWT) throws SecurityException {
        // ověř login JWT
        String userID = verifyJWT(loginJWT, rsaLoginTokenKey, loggedIn);

        // pokud id Učivatele není ""
        if (!userID.equals("")) {
            // nadi uživatele podle id
            User user = userRepository.findById(userID).get();
            try {
                // vygeneruj přístupový token
                // v jinýc případech vyhodnoť jako vyjímku SecurityException
                return generateAccessToken(user);
            } catch (JoseException e) {
                throw new SecurityException("Invalid Token.");
            }
        } else
            throw new SecurityException("Invalid Token.");
    }

    /**
     * Metoda pro zneplatnění token
     * 
     * @param loginJWT login JWT
     */
    public void logout(String loginJWT) {
        loggedIn.remove(loginJWT);
    }

    /**
     * Metoda pro vygenerování register JWT
     * 
     * @param user uživatel pro, kterého bude token vygenerován
     * @return dočasný JWT
     * @throws JoseException chyba při generování tokenu vyvolá tuto vyjímku
     */
    private String generateTempJWT(User user) throws JoseException {
        // nastavení parametrů JWT
        JwtClaims claims = new JwtClaims();
        claims.setIssuer(ISSUER); // vydavatel
        claims.setAudience(AUDIENCE); // publikum
        claims.setGeneratedJwtId();
        claims.setIssuedAtToNow(); // kdy byl vydán
        claims.setSubject(user.getId()); // nastav předmět na id uživatele

        // převeď claimy na JWS
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());

        // přidej šifrování
        jws.setKey(rsaTempTokenKey.getPrivateKey());
        jws.setKeyIdHeaderValue(rsaTempTokenKey.getKeyId());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);

        // skompiluj do tokenu
        String jwt = jws.getCompactSerialization();
        return jwt;
    }

    /**
     * Metoda pro vygenerování login JWT
     * 
     * @param user uživatel pro, kterého bude token vygenerován
     * @return login JWT
     * @throws JoseException chyba při generování tokenu vyvolá tuto vyjímku
     */
    private String generateLoginJWT(User user) throws JoseException {
        // nastavení parametrů JWT
        JwtClaims claims = new JwtClaims();
        claims.setIssuer(ISSUER); // vydavatel
        claims.setAudience(AUDIENCE); // publikum
        claims.setGeneratedJwtId();
        claims.setIssuedAtToNow(); // kdy byl vydán
        claims.setSubject(user.getId()); // nastav předmět na id uživatele
        claims.setClaim("email", user.getEmail()); // nastav email
        claims.setClaim("active", user.isActive()); // nastav informaci o tom, zda je účet aktivován

        // převeď claimy na JWS
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());

        // přidej šifrování
        jws.setKey(rsaLoginTokenKey.getPrivateKey());
        jws.setKeyIdHeaderValue(rsaLoginTokenKey.getKeyId());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);

        // skompiluj do tokenu
        String jwt = jws.getCompactSerialization();
        return jwt;
    }

    /**
     * Metoda pro vygenerování access JWT
     * 
     * @param user uživatel pro, kterého bude token vygenerován
     * @return login JWT
     * @throws JoseException chyba při generování tokenu vyvolá tuto vyjímku
     */
    private String generateAccessToken(User user) throws JoseException {
        // nastavení parametrů JWT
        JwtClaims claims = new JwtClaims();
        claims.setIssuer(ISSUER); // vydavatel
        claims.setAudience(AUDIENCE); // publikum
        claims.setGeneratedJwtId();
        claims.setIssuedAtToNow(); // kdy byl vydán
        // TODO test zda toto funguje. Cílem je nastavit životnost tokenu na půl minuty
        claims.setExpirationTimeMinutesInTheFuture((float) 0.5); // jak dlouho bude použitelný
        claims.setSubject(user.getId()); // nastav předmět na id uživatele
        claims.setClaim("active", user.isActive()); // nastav informaci o tom, zda je účet aktivován

        // převeď claimy na JWS
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());

        // přidej šifrování
        jws.setKey(rsaAccessTokenKey.getPrivateKey());
        jws.setKeyIdHeaderValue(rsaAccessTokenKey.getKeyId());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_PSS_USING_SHA256);

        // skompiluj do tokenu
        String jwt = jws.getCompactSerialization();
        return jwt;
    }

    /**
     * Metoda vygeneruje pro uživatele nové id pro zařízení a přidá mu ho
     * 
     * @param user
     * @return přidané id pro zařízení
     */
    private String addDeviceIDToUser(User user) {
        boolean generatedSuccessly = false;
        String deviceID = null;

        while (!generatedSuccessly) {
            deviceID = RandomStringGenerator.generateRandomString("Device_");

            generatedSuccessly = user.getTrustedDevicesId().contains(deviceID);
        }

        user.getTrustedDevicesId().add(deviceID);
        return deviceID;
    }

    /**
     * Metoda ověří zda je login JWT pravý
     * 
     * @param loginJWT login JWT, u kterého se ověřuje provost
     * @return id uživatele, kterému byl token vystaven
     * @throws SecurityException k vyvolání výjimky dojde pokud je token podvržený,
     *                           nebo pokud už není platný
     */
    public String verifyJWT(String JWT, RsaJsonWebKey key, Set<String> availavbleTokens) throws SecurityException {

        // načti obsah JWT
        JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                .setRequireSubject()
                .setExpectedIssuer(ISSUER)
                .setExpectedAudience(AUDIENCE)
                .setVerificationKey(key.getKey())
                .setJwsAlgorithmConstraints(ConstraintType.PERMIT, AlgorithmIdentifiers.RSA_PSS_USING_SHA256)
                .build();

        try {
            // zkus získat claimy
            JwtClaims jwtClaims = jwtConsumer.processToClaims(JWT);

            // pokud je token v množině aktivnch vrať id uživatele
            if (availavbleTokens.contains(JWT))
                return jwtClaims.getSubject();
            else
                throw new SecurityException("Invalid Permition");
        } catch (MalformedClaimException | InvalidJwtException e) {
            throw new SecurityException("Invalid Login Token");
        }

    }

    /**
     * Metoda ověří zda uživatel s daným access JWT má právo provést určitou operaci
     * 
     * @param accessJWT          přístupový JWT
     * @param requiredPermission požadované oprávnění
     * @return pokud uživatel má právo danou operaci provést vrátí se objekt, který
     *         ho reprezentuje
     * @throws SecurityException pokud je JWT podvržený, nebo je neplatný, případně
     *                           když uživatel nemá požadované oprávnění, nebo,
     *                           pokud uživatel není aktivovaný
     */
    public User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException {

        // získen z přístupového JWT uživatele
        User user = loadUserFromAccessToken(accessJWT);

        // pokud uživatelský účet není aktovovaný vyvolej výjimku
        if (!user.isActive())
            throw new SecurityException("Invalid User");

        // koukni, zda uživatele má požadovné opávnění
        if (user.getRole().containsPermission(requiredPermission)) {
            return user;
        }
        throw new SecurityException("Invalid Permission");
    }

    /**
     * Metoda ověří, zda uživatel přistupuje ze známého zařízení
     * 
     * @param accessJWT přístupový JWT
     * @param deviceID  id zařízení, zekterého přišel dotaz
     * @return Pokud deviceID je mezi množonou důvěryhodných zařízení vrátí se
     *         objekt, který ho reprezentuje. Pokud je accessJWT null metoda vrátí
     *         null.
     * @throws SecurityException pokud je JWT podvržený, nebo je neplatný, případně
     *                           když id zařízení není mezi důvěryhodnýma zažízeníma
     */
    public User verifyDevice(String accessJWT, String deviceID) throws SecurityException {

        // pokud je JWT uživatel není přihlášený, zařízení není důvěryhodné
        if (accessJWT == null) {
            return null;
        }

        // získen z přístupového JWT uživatele
        User user = loadUserFromAccessToken(accessJWT);

        // koukni, zda je zařízení mezi důvěryhodnými
        if (user.getTrustedDevicesId().contains(deviceID)) {
            return user;
        }
        throw new SecurityException("Invalid Device");
    }

    /**
     * Metoda načte uživatele pomocí id v přístupovém JWT
     * 
     * @param accessJWT přístupový JWT
     * @return instance třídy User, reprezentující uživatele
     * @throws SecurityException pokud je JWT podvržený, nebo je neplatný
     */
    private User loadUserFromAccessToken(String accessJWT) throws SecurityException {
        // načti obsah JWT
        JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                .setRequireSubject()
                .setExpectedIssuer(ISSUER)
                .setExpectedAudience(AUDIENCE)
                .setVerificationKey(rsaAccessTokenKey.getKey())
                .setJwsAlgorithmConstraints(ConstraintType.PERMIT, AlgorithmIdentifiers.RSA_USING_SHA256)
                .build();

        try {
            // zkus získat claimy
            JwtClaims jwtClaims = jwtConsumer.processToClaims(accessJWT);

            // získej si uživatele
            String userID = jwtClaims.getSubject();
            User user = userRepository.findById(userID).get();

            return user;
        } catch (InvalidJwtException | MalformedClaimException e) {
            throw new SecurityException("Invalid Token");
        }
    }
}
