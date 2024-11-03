package cz.rozek.jan.cinema_town.servicies.paymentService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.stripe.Stripe;
import com.stripe.model.Charge;

import cz.rozek.jan.cinema_town.models.primary.AgeCategory;
import cz.rozek.jan.cinema_town.models.primary.Reservation;

@Payment("visa") // třída bude mapovaná pod stringem 'visa'
@Component
public class VisaPayment implements IPayment {

    @Autowired
    VisaPayment() {
        Stripe.apiKey = "API_KEY"; 
    }

    @Override
    public double pay(Reservation reservation, Map<String, String> paymentData) throws Exception {
        
        String token = paymentData.get("token");

        double price = 0;

        for (AgeCategory ac : reservation.getCodes().values()) {
            price += Math.round(ac.getPriceModificator() * reservation.getProjection().getCost());
        }
        
        Map<String, Object> chargeParams = new HashMap<String, Object>();
        chargeParams.put("amount", (int)(price * 100));
        chargeParams.put("currency", "CZK");
        chargeParams.put("source", token);
        Charge.create(chargeParams);
        
        return price;
    }
}
