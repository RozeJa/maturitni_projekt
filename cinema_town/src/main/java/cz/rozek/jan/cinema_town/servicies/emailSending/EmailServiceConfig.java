package cz.rozek.jan.cinema_town.servicies.emailSending;

import java.io.File;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailServiceConfig {

    @Bean
    public EmailService getEmailService() {
        EmailService emailService = new EmailService();

        emailService.setTemplatesPath("./templates/");

        File file = new File(emailService.getTemplatesPath());
        file.mkdirs();

        return emailService;
    }
}
