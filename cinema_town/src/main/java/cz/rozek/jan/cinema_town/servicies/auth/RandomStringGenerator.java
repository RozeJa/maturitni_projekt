package cz.rozek.jan.cinema_town.servicies.auth;

public class RandomStringGenerator {

    private static final String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String numbers = "0123456789";

    public static String generateRandomString(boolean allowedChars, int length) {
        
        // urči kolekci znaků, ze které budou vybírány znaky
        String[] optionalsChars;

        if (allowedChars) {
            optionalsChars = (chars + numbers).split("");
        } else {
            optionalsChars = (numbers).split("");
        }

        StringBuilder sb = new StringBuilder();
        
        for (int i = 0; i < length; i++) {
            int position = (int) Math.round(Math.random() * (optionalsChars.length - 1)); 

            sb.append(optionalsChars[position]);
        }

        return sb.toString();
    }
}
