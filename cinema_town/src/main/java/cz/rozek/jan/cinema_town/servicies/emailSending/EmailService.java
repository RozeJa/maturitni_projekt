package cz.rozek.jan.cinema_town.servicies.emailSending;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService  {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String text) {
        
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("ciname.t0wn@gmail.com");
        message.setTo(to); 
        message.setSubject(subject); 
        message.setText(text);

        Thread t = new Thread(() -> emailSender.send(message));
        t.start();
    }
}
