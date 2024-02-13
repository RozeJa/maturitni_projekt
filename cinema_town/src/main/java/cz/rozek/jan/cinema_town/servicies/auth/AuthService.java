package cz.rozek.jan.cinema_town.servicies.auth;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.NotActiveException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.jose4j.jwa.AlgorithmConstraints.ConstraintType;
import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.PublicJsonWebKey;
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

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.dtos.SecondVerificationToken;
import cz.rozek.jan.cinema_town.models.stable.Role;
import cz.rozek.jan.cinema_town.models.stable.User;
import cz.rozek.jan.cinema_town.repositories.RoleRepository;
import cz.rozek.jan.cinema_town.repositories.UserRepository;

// třída poskytuje služby pro přihlášení, odhlášení a ověření přístupových práv
@Service
public class AuthService {

    // délka klíče
    private static final int rsaKeylength = 8192;

    // kořenová složka pro klíče
    private static final String rootDir = "./keys/";

    // klíč používaný k ověřování pravosti JWT, který se používá pro dvoufázové ověření
    private RsaJsonWebKey rsaTrustTokenKey;
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

    // mapa kde jsou pod aktivačnímy kódy mapováni id neaktivovaní uživatelé
    private Map<String, String> inactiveUsers = new HashMap<>();

    // mapa uživatelů, kteří čekají na zadání druhé fáze přihlášení
    // mapa je ve stylu userID => token
    private Map<String, SecondVerificationToken> secondVerification = new HashMap<>();

    // TODO sprovozdnit obnovení hesla
    // mapa ve které je uložen kód pro reserování => userID
    private Map<String, String> forgottenPWs = new HashMap<>();

    // množina obsahuje emaily uživatelů, kteří se přihlásili pod špatným heslem => snaha o spomalení útoku hrubou silou
    private Set<String> wrongLogin = new HashSet<String>();

    // repozitář pro přístup k uživatelúm
    private UserRepository userRepository;
    private RoleRepository roleRepository;

    // metoda pro vložení závislosti na UserRepository
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setRoleRepository(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public AuthService() {
        try {
            File file = new File(rootDir);
            file.mkdirs();
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            // získání klíče pro registraci
            rsaTrustTokenKey = gainRsaJwk("token-key");
    
            // získání klíče pro login
            rsaLoginTokenKey = gainRsaJwk("login-key");
    
            // získání klíče pro přístup
            rsaAccessTokenKey = gainRsaJwk("access-key");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Metoda se pokusí načíst klíč podle keyId, pokud se jí ho nepodaří načíst, vygeneruje si ho, uloží a vrátí. Klíč bude uložen pod keyId. Vrácený klíč bude mít keyId nastavené na to co dostala metoda v parametru
     * @param keyId keyId vráceného klíče bude mít tento parametr
     * @return vygenerovaný / načtený klíč
     * @throws IOException problém se čtením / zápisem 
     * @throws JoseException problém s generobáním 
     */
    private RsaJsonWebKey gainRsaJwk(String keyId) throws IOException, JoseException {
        // vytvor si objekt souboru
        File keyFile = new File(rootDir + keyId);

        // zkus najít klíč a načíst ho
        try (BufferedReader reader = new BufferedReader(new FileReader(keyFile))) {
            String keyJson = reader.readLine();

            if (keyJson != null)
                return (RsaJsonWebKey) PublicJsonWebKey.Factory.newPublicJwk(keyJson);
            else {
                return generateJwk(keyId, keyFile);
            }
        } catch (IOException e) {
            return generateJwk(keyId, keyFile);
        }
    }

    /**
     * 
     * @param keyId keyId vráceného klíče bude mít tento parametr
     * @param keyFile soubor, do kterého se má ulozit klíč
     * @return vygenerovaný
     * @throws IOException problém se zápisem 
     * @throws JoseException problém s generobáním
     */
    private RsaJsonWebKey generateJwk(String keyId, File keyFile) throws IOException, JoseException {
        // Pokud klíč neexistuje, tak ho vygeneruj
        RsaJsonWebKey key = RsaJwkGenerator.generateJwk(rsaKeylength);
        key.setKeyId(keyId);
    
        // preved ho na json
        String jwkjson = key.toJson(JsonWebKey.OutputControlLevel.INCLUDE_PRIVATE);
        // a uloz ho
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(keyFile))) {
            writer.write(jwkjson);       
        }
    
        // vrat vygenerovaný klíč
        return key;
    }

    /**
     * Metoda zaregistruje uživatele do systému
     * 
     * @param user // nový uživatel
     * @return objekt, reprezentující uživatele, i s id
     */
    public String register(User user) throws JoseException, ValidationException {

        User newUser = new User();

        // přidej uživateli roli
        Role role = roleRepository.findByName("user");
        newUser.setRole(role);
        
        // zvaliduj uživatele
        user.validate();

        // změň heslo na hash
        newUser.setEmail(user.getEmail());
        newUser.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));

        // vygeneruj pro něj jednorázový aktivační kód
        String activationCode = RandomStringGenerator.generateRandomString(false, 10);
        // načti si uživatele
        newUser = userRepository.save(newUser);

        inactiveUsers.put(activationCode, newUser.getId());

        return activationCode;
    }

    /**
     * Metoda pro aktivaci uživatelského účtu
     * 
     * @param activationCode kód pro oktivaci uživatele
     * @return vrátí JWT, který je použitý pro dvoufázové ověření
     * @throws SecurityException k vyvolání výjimky dojde když by byl loginToken
     *                           podvržený, nebo neplatný
     */
    public String activateUser(String activationCode) throws SecurityException, JoseException {

        // zjisti zda pod aktivačním kódem někoho máš
        String expectedUserID = inactiveUsers.get(activationCode);
        if (expectedUserID != null) {

            User user = userRepository.findById(expectedUserID).get();

            // pokud je, aktivuj ho
            user.setActive(true);

            // vygeneruj uživateli token pro důvěru zařízení
            String trustToken = generateTrustToken(user);

            // ulož změny
            userRepository.save(user);

            // odeber aktivovaného uživatele z mapy pro neaktivované
            inactiveUsers.remove(activationCode);

            return trustToken;
        }

        // když buť pod kódem nikoho nemáš, nebo pokud se uživatel neshoduje vtať null
        return null;
    }

    /**
     * Metoda pro vygenerování jiného aktivačního kódu
     * 
     * @param user
     * @return vrátí nový aktivační kód
     * @throws SecurityException k vyvolání výjimky dojde když by byl loginToken
     *                           podvržený, nebo neplatný
     */
    public String resetActivationCode(User user) throws SecurityException {

        // TODO omezit časově

        // pokud účet ještě není aktivovaný, vygeneruj nový token
        User loaded = userRepository.findByEmail(user.getEmail());
        if (loaded.isActive())
            return "";

        String oldActivationCode = "";
        String newActivationCode = "";
        for (String activationCode : inactiveUsers.keySet()) {
            if (inactiveUsers.get(activationCode).equals(loaded.getId())) {
                newActivationCode = RandomStringGenerator.generateRandomString(true, 10);
                oldActivationCode = activationCode;
                break;
            }
        }

        newActivationCode = RandomStringGenerator.generateRandomString(true, 10);

        inactiveUsers.remove(oldActivationCode);
        inactiveUsers.put(newActivationCode, loaded.getId());

        return newActivationCode;
    }

    /**
     * metoda pro přihlášení uživatele
     * 
     * @param user uživatel
     * @return login JWT
     * @throws SecurityException výjimka je vyvolány při nesprávném hesle
     * @throws JoseException     nastala chyba při vytváření tokenu
     */
    public String login(User user, String trustJWT, boolean isSecond)
            throws SecurityException, JoseException, NotActiveException, InterruptedException {
        
        // pokud se email, na který se uživatel snaží přihlásit v kolekci, tak dál nepokračuj
        if (wrongLogin.contains(user.getEmail())) 
            throw new SecurityException("To fast login");

        // najdi uživatele v db podle emailu
        User userFromDB = userRepository.findByEmail(user.getEmail());

        // ověř zda údaje sedí
        if (verifyUserLogin(user) || isSecond) {

            // uživatel se přihásil správně zkontroluj, zda se přihlašuje ze známého
            // zařízení

            String userId = "";
            try {
                userId = verifyJWT(trustJWT, rsaTrustTokenKey, null);
            } catch (Exception e) {
            }

            if (userId.equals(userFromDB.getId())) {

                // heslo je správné => vytvoř token
                String jwt = generateLoginJWT(userFromDB);
                // přidej do množiny přihlášených ten token
                loggedIn.add(jwt);
                // vrať login JWT
                return "login#" + jwt;

                // uživatel se nepřihlašuje, ze známého zařízení
            } else {
                // vygeneruj přístupový token
                String token = RandomStringGenerator.generateRandomString(false, 10);

                SecondVerificationToken svt = new SecondVerificationToken();
                svt.setUserID(userFromDB.getId());
                svt.setExpiration(LocalDateTime.now());
                svt.setMinutesToExpire(10);

                // přidej do mapy pro druhé ověření pod token id uživatele
                secondVerification.put(token, svt);

                return "token#" + token;
            }
        } else {

            // ulož email do momentálně nedostupných
            wrongLogin.add(user.getEmail());

            // počkej 2 sekundy
            Thread.sleep(2000);

            // umožni uživateli se znovu přihlásit
            wrongLogin.remove(user.getEmail());
    
            // heslo není správné vyvolej SecurityException
            throw new SecurityException("Password isn´t right.");
        }
    }

    /**
     * 
     * @param tempToken        dočasný JWT
     * @param verificationCode kód, kterým se má uživatel prokázat
     * @return uživatel
     */
    public User secondVerification(String verificationCode) throws NullPointerException, SecurityException {

        String userID = secondVerification.get(verificationCode).getUserID();

        // zjisti si jaký aktivační kód k tomuto uživateli patří, pokud je null vyvolej
        // vyjímku
        if (userID == null || secondVerification.get(verificationCode).isExpired())
            throw new NullPointerException();

        // odeber záznam z kolekce
        secondVerification.remove(verificationCode);
        return userRepository.findById(userID).get();
    }

    /**
     * ověří přihlášení uživatele
     * @param user
     * @return
     * @throws NotActiveException
     */
    public boolean verifyUserLogin(User user) throws NotActiveException {
        User userFromDB = null;
        
        if (!user.getEmail().equals(""))
            userFromDB = userRepository.findByEmail(user.getEmail());
         else userFromDB = userRepository.findById(user.getId()).get();

        if (userFromDB == null)
            return false;

        if (!userFromDB.isActive())
            throw new NotActiveException();

        return BCrypt.checkpw(user.getPassword(), userFromDB.getPassword());
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
     * Metoda pro vygenerování JWT pro dvoufázové ověření
     * 
     * @param user uživatel pro, kterého bude token vygenerován
     * @return login JWT
     * @throws JoseException chyba při generování tokenu vyvolá tuto vyjímku
     */
    public String generateTrustToken(User user) throws JoseException {
        // nastavení parametrů JWT
        JwtClaims claims = new JwtClaims();
        claims.setIssuer(ISSUER); // vydavatel
        claims.setAudience(AUDIENCE); // publikum
        claims.setGeneratedJwtId();
        claims.setIssuedAtToNow(); // kdy byl vydán
        claims.setExpirationTimeMinutesInTheFuture(60 * 24 * 30); // jak dlouho bude použitelný
        claims.setSubject(user.getId()); // nastav předmět na id uživatele
        claims.setClaim("active", user.isActive()); // nastav informaci o tom, zda je účet aktivován

        // převeď claimy na JWS
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());

        // přidej šifrování
        jws.setKey(rsaTrustTokenKey.getPrivateKey());
        jws.setKeyIdHeaderValue(rsaTrustTokenKey.getKeyId());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_PSS_USING_SHA256);

        // skompiluj do tokenu
        return jws.getCompactSerialization();
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

        // přidej do login tokenu oprávnění
        List<String> permissions = user.loadPermissions();
        claims.setStringListClaim("permissions", permissions);

        // převeď claimy na JWS
        JsonWebSignature jws = new JsonWebSignature();
        jws.setPayload(claims.toJson());

        // přidej šifrování
        jws.setKey(rsaLoginTokenKey.getPrivateKey());
        jws.setKeyIdHeaderValue(rsaLoginTokenKey.getKeyId());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_PSS_USING_SHA256);

        // skompiluj do tokenu
        return jws.getCompactSerialization();
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
        claims.setExpirationTimeMinutesInTheFuture(1); // jak dlouho bude použitelný
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
        return jws.getCompactSerialization();
    }

    public String verifyLoginJWT(String loginJWT) {
        return verifyJWT(loginJWT, rsaLoginTokenKey, loggedIn);
    }

    /**
     * Metoda ověří zda je login JWT pravý
     * 
     * @param JWT login JWT, u kterého se ověřuje provost
     * @return id uživatele, kterému byl token vystaven
     * @throws SecurityException k vyvolání výjimky dojde pokud je token podvržený,
     *                           nebo pokud už není platný
     */
    private String verifyJWT(String JWT, RsaJsonWebKey key, Set<String> availavbleTokens) throws SecurityException {

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

            // pokud jsou povolené jen nějaké token, tak se v nich musí token nacházet
            if (availavbleTokens == null) 
                return jwtClaims.getSubject();
            // pokud je token v množině aktivnch vrať id uživatele
            else if (availavbleTokens.contains(JWT))
                return jwtClaims.getSubject();
            else
                throw new SecurityException("Invalid Permition");
        } catch (MalformedClaimException | InvalidJwtException e) {
            throw new SecurityException("Invalid Token");
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
        if (user.getRole().containsPermission(requiredPermission) || requiredPermission.equals("")) {
            return user;
        }
        throw new SecurityException("Invalid Permission");
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
                .setJwsAlgorithmConstraints(ConstraintType.PERMIT, AlgorithmIdentifiers.RSA_PSS_USING_SHA256)
                .build();

        try {
            // zkus získat claimy
            JwtClaims jwtClaims = jwtConsumer.processToClaims(accessJWT);

            // získej si uživatele
            String userID = jwtClaims.getSubject();
            return userRepository.findById(userID).get();
        } catch (InvalidJwtException | MalformedClaimException e) {
            throw new SecurityException("Invalid Token");
        }
    }
}
