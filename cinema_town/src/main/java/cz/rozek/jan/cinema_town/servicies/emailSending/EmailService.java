package cz.rozek.jan.cinema_town.servicies.emailSending;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService  {

    @Autowired
    private JavaMailSender emailSender;
    private String templatesPath;

    public String getTemplatesPath() {
        return templatesPath;
    }
    public void setTemplatesPath(String templatesPath) {
        this.templatesPath = templatesPath;
    }

    public EmailTemplate loadTemplate(String templateName, Map<String, String> paceholders) {
        EmailTemplate template = loadTemplate(templateName);

        for (String placeholder : paceholders.keySet()) {
           template.replace(placeholder, paceholders.get(placeholder));
        }

        return template;
    }

    public EmailTemplate loadTemplate(String templateName) {

        File template = new File(templatesPath + templateName);

        StringBuffer sb = new StringBuffer();

        try (BufferedReader  br = new BufferedReader(new FileReader(template))) {
            
            String row;
            while ((row = br.readLine()) != null) {
                sb.append(row);
            }
        } catch (Exception e) {
        }

        EmailTemplate text = new EmailTemplate();
        text.setText(sb.toString());
        return text;
    }


    public void sendEmail(String to, String subject, EmailTemplate text) {
        sendEmail(to, subject, text, null);
    }

    public void sendEmail(String to, String subject, EmailTemplate text, String attachmentPath) {
        MimeMessage message = emailSender.createMimeMessage();

        try {
            // Use the true flag to enable multipart mode
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("ciname.t0wn@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text.getText(), true);
            
            // Nastavení unikátního Message-ID
            String messageId = "Message-ID-" + System.currentTimeMillis();
            message.setHeader("Message-ID", messageId);

            if (attachmentPath != null) {
                // Attach the file
                Path file = Paths.get(attachmentPath);
                ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(file));
                helper.addAttachment(file.getFileName().toString(), resource);
            }

        } catch (MessagingException | IOException e) {
            e.printStackTrace();
        }

        Thread t = new Thread(() -> emailSender.send(message));
        t.start();
    }
}
