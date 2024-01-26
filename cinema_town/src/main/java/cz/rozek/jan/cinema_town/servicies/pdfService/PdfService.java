package cz.rozek.jan.cinema_town.servicies.pdfService;

import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.models.stable.AgeCategory;
import cz.rozek.jan.cinema_town.models.stable.Cinema;
import cz.rozek.jan.cinema_town.models.stable.Hall;
import cz.rozek.jan.cinema_town.models.stable.Seat;
import cz.rozek.jan.cinema_town.repositories.CinemaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.util.TreeMap;
import java.util.List;
import java.util.Map;

import java.nio.file.Path;

@Service
public class PdfService {

    @Autowired
    private CinemaRepository cinemaRepository;

    private String rootDir = "";

    public String getRootDir() {
        return rootDir;
    }

    public void setRootDir(String rootDir) {
        this.rootDir = rootDir;
    }

    public String generatePdfTickets(Reservation reservation) throws DocumentException, IOException, WriterException {
        // vytvoř složku pro rezervaci
        String dirPath = rootDir + reservation.getId();
        String filePath = "./rezervace.pdf";

        File f = new File(dirPath);
        f.mkdir();

        Document document = new Document();
        // TODO document.setHtmlStyleClass();
        PdfWriter.getInstance(document, new FileOutputStream(dirPath + filePath));
        document.open();

        // Informace o rezervaci
        addReservationInfo(document, reservation);

        // Informace o lístcích
        addTickets(document, reservation, dirPath);

        document.close();

        // Smaž qr kód 
        f = new File(dirPath + "/qrcode.png");
        f.delete();
        
        return dirPath + filePath;
    }

    private void addReservationInfo(Document document, Reservation reservation) throws DocumentException {

        Cinema cinema = findCinema(reservation);

        String filmName = reservation.getProjection().getFilm().getName();
        String hallDes = reservation.getProjection().getHall().getDesignation();
        String address = String.format("%s, %s, %s", cinema.getCity().getName(), cinema.getStreet(), cinema.getHouseNumber());
        String datetime = reservation.getProjection().getDateTime().toString(); 

        document.add(new Paragraph(String.format("Rezervace filmového promítání: %s\nMíto promítání: %s \tHala: \nDatum a čas konání promátání %s", filmName, address, hallDes, datetime)));


        Map<String, Float> grupedCategories = groupCategories(reservation);
        float[] tableColumns = new float[grupedCategories.size() + 2];
        for (int i = 0; i < tableColumns.length; i++) {
            tableColumns[i] = (float) 1;
        }

        PdfPTable table = new PdfPTable(tableColumns);
        table.setWidthPercentage(80);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        PdfPCell cell1 = new PdfPCell(new Phrase("Věková kategorie"));
        PdfPCell cell2 = new PdfPCell(new Phrase("Počet kusů"));
        PdfPCell cell3 = new PdfPCell(new Phrase("Cena za kus"));
        PdfPCell cell4 = new PdfPCell(new Phrase("Cena celkem"));

        table.addCell(cell1);
        table.addCell(cell2);
        table.addCell(cell3);
        table.addCell(cell4);

        double totalCost = 0;
        for (String categoryId : grupedCategories.keySet()) {
            AgeCategory ac = reservation.getCodes().values().stream().filter(ageCategory -> ageCategory.getId().equals(categoryId)).toList().get(0);
            double pricePerOne = Math.round(ac.getPriceModificator() * reservation.getProjection().getCost());
            double priceForAll = pricePerOne * grupedCategories.get(categoryId);
            totalCost += priceForAll;
            
            cell1 = new PdfPCell(new Phrase(ac.getName()));
            cell2 = new PdfPCell(new Phrase(grupedCategories.get(categoryId)));
            cell3 = new PdfPCell(new Phrase(String.valueOf(pricePerOne)));
            cell4 = new PdfPCell(new Phrase(String.valueOf(priceForAll)));

            table.addCell(cell1);
            table.addCell(cell2);
            table.addCell(cell3);
            table.addCell(cell4);
        }

        cell1 = new PdfPCell(new Phrase("Celkem"));
        cell2 = new PdfPCell(new Phrase(grupedCategories.values().stream().count()));
        cell3 = new PdfPCell(new Phrase());
        cell4 = new PdfPCell(new Phrase(String.valueOf(totalCost)));

        table.addCell(cell1);
        table.addCell(cell2);
        table.addCell(cell3);
        table.addCell(cell4);

        document.add(table);
    }

    private Cinema findCinema(Reservation reservation) {
        List<Cinema> cinemas = cinemaRepository.findAll();
        reservation.getProjection().getHall();

        for (Cinema c : cinemas) {
            for (Hall h : c.getHalls().values()) {
                if (h.getId().equals(reservation.getProjection().getHall().getId())) {
                    return c;
                }
            }
        }

        return null;
    }

    private Map<String, Float> groupCategories(Reservation reservation) {        
        Map<String, Float> tableRows = new TreeMap<>();
        for (AgeCategory ac : reservation.getCodes().values()) {
            if (tableRows.get(ac.getId()) != null) {
                tableRows.put(ac.getId(), tableRows.get(ac.getId()) +1);
            } else {
                tableRows.put(ac.getId(), (float) 1);
            }
        }

        return tableRows;
    }

    private void addTickets(Document document, Reservation reservation, String dirPath) throws DocumentException, IOException, WriterException {
        for (String code : reservation.getCodes().keySet()) {
            String category = reservation.getCodes().get(code).getName();
            String seats = getSeats(reservation);
            String hall = reservation.getProjection().getHall().getDesignation();
            String startTime = reservation.getProjection().getDateTime().toString();

            addTicket(document, category, seats, hall, startTime, code, dirPath);
        }
    }

    private String getSeats(Reservation reservation) {
        Map<String, String> seats = new TreeMap<>();

        for (Seat s : reservation.getSeats()) {
            if (seats.get(s.getRowDesignation()) == null) {
                seats.put(s.getRowDesignation(), String.valueOf(s.getNumber()));  
            } else {
                seats.put(s.getRowDesignation(), seats.get(s.getRowDesignation()) + ", " + s.getNumber()); 
            }
        }

        StringBuilder sb = new StringBuilder();

        for (String rowDesignation : seats.keySet()) {
            sb.append(String.format("Řada: %s sedadla: %s\n", rowDesignation, seats.get(rowDesignation)));
        }
        return sb.toString();
    }

    private void addTicket(Document document, String category, String seats, String hall, String startTime, String code, String dirPath) throws DocumentException, IOException, WriterException {

        // Ohraničení pro lístek
        Rectangle border = new Rectangle(PageSize.A6);
        border.setBorder(Rectangle.BOX);
        border.setBorderWidth(2);
        border.setBorderColor(BaseColor.BLACK);

        // Vytvoření lístku s ohraničením
        PdfPTable ticketTable = new PdfPTable(1);
        ticketTable.setWidthPercentage(100);
        ticketTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
        ticketTable.addCell(new PdfPCell(new Phrase("Informace o lístku:")));
        ticketTable.addCell(new PdfPCell(new Phrase("Věková kategorie: " + category)));
        ticketTable.addCell(new PdfPCell(new Phrase("Sedadla: " + seats)));
        
        // Generování QR kódu
        
        Path qrCodePath = generateQRCodeImage(code, dirPath);
        Image qrCodeImage = Image.getInstance(qrCodePath.toString());
        PdfPCell qrCodeCell = new PdfPCell(qrCodeImage);
        qrCodeCell.setBorder(Rectangle.NO_BORDER);
        ticketTable.addCell(qrCodeCell);

        ticketTable.addCell(new PdfPCell(new Phrase("Sál: " + hall)));
        ticketTable.addCell(new PdfPCell(new Phrase("Čas začátku promítání: " + startTime)));

        // Přidání lístku s ohraničením do dokumentu
        PdfPCell ticketCell = new PdfPCell(ticketTable);
        ticketCell.setBorder(Rectangle.NO_BORDER);
        ticketCell.setBorder(Rectangle.BOX);
        ticketCell.setBorderWidth(2);
        ticketCell.setBorderColor(BaseColor.BLACK);

        PdfPTable tableWithBorder = new PdfPTable(1);
        tableWithBorder.setWidthPercentage(100);
        tableWithBorder.addCell(ticketCell);

        document.add(tableWithBorder);
    }

    private Path generateQRCodeImage(String qrCodeData, String dirPath) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeData, com.google.zxing.BarcodeFormat.QR_CODE, 200, 200);

        Path qrCodePath = FileSystems.getDefault().getPath(dirPath + "/qrcode.png");
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", qrCodePath);

        return qrCodePath;
    }

}
