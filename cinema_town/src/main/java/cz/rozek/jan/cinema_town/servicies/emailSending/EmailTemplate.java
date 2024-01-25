package cz.rozek.jan.cinema_town.servicies.emailSending;

public class EmailTemplate {
    
    private String text = "";

    EmailTemplate() {}


    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }

    public boolean replace(String paleceHolder, String data) {
        String defText = text;

        text = text.replaceAll(paleceHolder, data);
        
        return !text.equals(defText);
    } 
}
