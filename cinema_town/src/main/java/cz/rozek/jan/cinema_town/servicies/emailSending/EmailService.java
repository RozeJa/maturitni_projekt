package cz.rozek.jan.cinema_town.servicies.emailSending;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService  {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(
      String to, String subject, String text) {
        
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("test@cinema-town.com");
        message.setTo(to); 
        message.setSubject(subject); 
        message.setText(text);

        emailSender.send(message);
    }
}
