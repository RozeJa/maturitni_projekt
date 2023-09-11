package cz.rozek.jan.cinema_town.servicies;

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
public class Auth {

    private RsaJsonWebKey rsaLoginTokenKey;
    private RsaJsonWebKey rsaAccessTokenKey;
    
    private static final String ISSUER = "CinemaTown";
    private static final String AUDIENCE = "CinemaTown";

    private Set<String> loggedIn = new HashSet<>();

    private UserRepository userRepository;

    @Autowired 
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Auth() {
        try {
            rsaLoginTokenKey = RsaJwkGenerator.generateJwk(2048);
            rsaLoginTokenKey.setKeyId("login-key");

            rsaAccessTokenKey = RsaJwkGenerator.generateJwk(2048);
            rsaAccessTokenKey.setKeyId("access-key");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String login(User user) throws SecurityException, JoseException {
        User userFromDB = userRepository.findByEmail(user.getEmail());

        if (userFromDB == null) 
            throw new NullPointerException();
        
        if (BCrypt.checkpw(user.getPassword(), userFromDB.getPassword())) {
            String token = generateLoginJWT(userFromDB);
            loggedIn.add(token);
            return token;
        } else
            throw new SecurityException("Password isn´t right.");
    }

    public String generateAccessToken(String loginJWT) throws Exception {
        String userID = verifiLoginToken(loginJWT);

        if (!userID.equals("")) {
            User user = userRepository.findById(userID).get();
            return getAccessToken(user);
        } else 
            throw new SecurityException("Invalid Token.");
    }

    public void logout(String loginJWT) {
        loggedIn.remove(loginJWT);
    }

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

    private String getAccessToken(User user) throws JoseException {
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

    public String verifiLoginToken(String loginJWT) throws Exception {
        JwtConsumer jwtConsumer = new JwtConsumerBuilder()
        .setRequireSubject()
        .setExpectedIssuer(ISSUER)
        .setExpectedAudience(AUDIENCE)
        .setVerificationKey(rsaLoginTokenKey.getKey())
        .setJwsAlgorithmConstraints(ConstraintType.PERMIT, AlgorithmIdentifiers.RSA_PSS_USING_SHA256)
        .build();

        JwtClaims jwtClaims = jwtConsumer.processToClaims(loginJWT);

        if (loggedIn.contains(loginJWT)) 
            return jwtClaims.getSubject();
         else 
            throw new SecurityException("Unloget Login Token"); 
    }

    public User verifiAccess(String accessJWT, String requiredPermition) {
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
                if (user.getRole().containsPermition(requiredPermition)) {
                    return user;
                }
            } 
            throw new SecurityException();
        } catch (InvalidJwtException | MalformedClaimException e) {
            throw new SecurityException();
        }
    }

    
}       
