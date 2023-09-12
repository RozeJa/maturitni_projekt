package cz.rozek.jan.cinema_town.servicies.auth;

import java.util.HashSet;
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

@Service
public class AuthService {

    // klíč používaný k ověřování pravost JWT, který se používá pro login
    private RsaJsonWebKey rsaLoginTokenKey;
    // klíč používaný k ověřování pravost JWT, který se používá jako přístupový 
    private RsaJsonWebKey rsaAccessTokenKey;
    
    // kdo je vydavatel JWT
    private static final String ISSUER = "CinemaTown";
    // pro koho je vydáván JWT
    private static final String AUDIENCE = "CinemaTown";

    // množina vydaných a aktivních JWT, používaných pro login
    private Set<String> loggedIn = new HashSet<>();

    // repozitář pro přístup k uživatelúm
    private UserRepository userRepository;

    // metoda pro vložení závislosti na UserRepository
    @Autowired 
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthService() {
        try {
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
     * metoda pro přihlášení uživatele
     * @param user uživatel
     * @return login JWT
     * @throws SecurityException výjimka je vyvolány při nesprávném hesle
     * @throws JoseException nastala chyba při vytváření tokenu
     */
    public String login(User user) throws SecurityException, JoseException {
        // najdi uživatele v db podle emailu
        User userFromDB = userRepository.findByEmail(user.getEmail());

        // pokud uživatel neexistuje vyvolej NullPointerException
        if (userFromDB == null) 
            throw new NullPointerException();
        
        // pokud uživatel existuje použij BCrypt k ověření hesla
        if (BCrypt.checkpw(user.getPassword(), userFromDB.getPassword())) {
            // heslo je správné => vytvoř token
            String token = generateLoginJWT(userFromDB);
            // přidej do množiny přihlášených ten token
            loggedIn.add(token);
            // vrať login JWT
            return token;
        } else
            // heslo není správné vyvolej SecurityException 
            throw new SecurityException("Password isn´t right.");
    }

    /**
     * metoda vrátí přístupový JWT pokud login JWT je přihlášený
     * @param loginJWT JWT používaný pro login
     * @return přístupový JWT 
     * @throws SecurityException k vyvolání výjimky dojde pokud login JWT není validní, nebo není přihlášen
     */
    public String getAccessToken(String loginJWT) throws SecurityException {
        // ověř login JWT
        String userID = verifyLoginToken(loginJWT);

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
     * @param loginJWT login JWT
     */
    public void logout(String loginJWT) {
        loggedIn.remove(loginJWT);
    }

    /**
     * Metoda pro vygenerování login JWT 
     * @param user uživatel pro, kterého bude token vygenerován
     * @return login JWT
     * @throws JoseException chyba při generování tokenu vyvolá tuto vyjímku
     */
    private String generateLoginJWT(User user) throws JoseException {
        JwtClaims claims = new JwtClaims();
        claims.setIssuer(ISSUER);
        claims.setAudience(AUDIENCE);
        claims.setGeneratedJwtId();
        claims.setIssuedAtToNow();
        claims.setSubject(user.getId());
        claims.setClaim("email", user.getEmail());

        JsonWebSignature jws = new JsonWebSignature();

        jws.setPayload(claims.toJson());

        jws.setKey(rsaLoginTokenKey.getPrivateKey());
        jws.setKeyIdHeaderValue(rsaLoginTokenKey.getKeyId());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);

        String jwt = jws.getCompactSerialization();
        return jwt;
    }

    private String generateAccessToken(User user) throws JoseException {
        JwtClaims claims = new JwtClaims();
        claims.setIssuer(ISSUER);
        claims.setAudience(AUDIENCE);
        claims.setGeneratedJwtId();
        claims.setIssuedAtToNow();
        // TODO test zda toto funguje. Cílem je nastavit životnost tokenu na půl minuty
        claims.setExpirationTimeMinutesInTheFuture((float)0.5);
        claims.setSubject(user.getId());
        claims.setClaim("email", user.getEmail());

        JsonWebSignature jws = new JsonWebSignature();

        jws.setPayload(claims.toJson());

        jws.setKey(rsaAccessTokenKey.getPrivateKey());
        jws.setKeyIdHeaderValue(rsaAccessTokenKey.getKeyId());
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_PSS_USING_SHA256);

        String jwt = jws.getCompactSerialization();
        return jwt;
    }

    public String verifyLoginToken(String loginJWT) throws SecurityException {
        JwtConsumer jwtConsumer = new JwtConsumerBuilder()
        .setRequireSubject()
        .setExpectedIssuer(ISSUER)
        .setExpectedAudience(AUDIENCE)
        .setVerificationKey(rsaLoginTokenKey.getKey())
        .setJwsAlgorithmConstraints(ConstraintType.PERMIT, AlgorithmIdentifiers.RSA_PSS_USING_SHA256)
        .build();

        try {
            JwtClaims jwtClaims = jwtConsumer.processToClaims(loginJWT);

            if (loggedIn.contains(loginJWT)) 
                return jwtClaims.getSubject();
            else 
                throw new SecurityException("Invalid Permition");            
        } catch (MalformedClaimException | InvalidJwtException e) {
            throw new SecurityException("Invalid Login Token");
        }
 
    }

    public User verifyAccess(String accessJWT, String requiredPermission) throws SecurityException {
        JwtConsumer jwtConsumer = new JwtConsumerBuilder()
        .setRequireSubject()
        .setExpectedIssuer(ISSUER)
        .setExpectedAudience(AUDIENCE)
        .setVerificationKey(rsaAccessTokenKey.getKey())
        .setJwsAlgorithmConstraints(ConstraintType.PERMIT, AlgorithmIdentifiers.RSA_USING_SHA256)
        .build();

        try {
            JwtClaims jwtClaims = jwtConsumer.processToClaims(accessJWT);

            String userID = jwtClaims.getSubject();

            User user = userRepository.findById(userID).get();
            
            if (user != null) {
                if (user.getRole().containsPermission(requiredPermission)) {
                    return user;
                }
            } 
        } catch (InvalidJwtException | MalformedClaimException e) {
            throw new SecurityException("Invalid Token");
        }
        throw new SecurityException("Invalid Permition");
    }

    
}       
