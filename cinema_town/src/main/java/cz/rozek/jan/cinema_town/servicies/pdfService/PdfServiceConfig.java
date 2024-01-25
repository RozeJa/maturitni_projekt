package cz.rozek.jan.cinema_town.servicies.pdfService;

import java.io.File;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PdfServiceConfig {
    
    @Bean
    public PdfService getEmailService() {
        PdfService pdfService = new PdfService();

        pdfService.setRootDir("./tickets/");

        File file = new File(pdfService.getRootDir());
        file.mkdirs();

        return pdfService;
    }
}
