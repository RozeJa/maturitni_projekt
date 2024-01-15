package cz.rozek.jan.cinema_town.servicies.paymentService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.stripe.Stripe;
import com.stripe.model.Charge;

import cz.rozek.jan.cinema_town.models.dynamic.Reservation;
import cz.rozek.jan.cinema_town.models.stable.AgeCategory;

@Payment("visa")
@Component
public class VisaPayment implements IPayment {

    @Autowired
    VisaPayment() {
        Stripe.apiKey = "sk_test_51OYl1pGYcwjrKZZT3keEujLTIgtjb1Lz4GFc5R9LhCCVEvZBZBR1hPy3NqrzrB4CmYJr5DfSplhUAlflwla8BcA300eAaL3T9d";
    }

    @Override
    public void pay(Reservation reservation, Map<String, String> paymentData, String accessJWT) throws Exception {
        
        String token = paymentData.get("token");

        double price = 0;

        for (AgeCategory ac : reservation.getCodes().values()) {
            price += Math.round(ac.getPriceModificator() * reservation.getProjection().getCost());
        }
        
        Map<String, Object> chargeParams = new HashMap<String, Object>();
        chargeParams.put("amount", (int)(price * 100));
        chargeParams.put("currency", "CZK");
        chargeParams.put("source", token);
        Charge charge = Charge.create(chargeParams);        
    }
}
