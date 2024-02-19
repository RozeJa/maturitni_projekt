package cz.rozek.jan.cinema_town.servicies.paymentService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.rozek.jan.cinema_town.models.ValidationException;
import cz.rozek.jan.cinema_town.models.primary.Reservation;

@Service
public class PaymentService {
    private final Map<String, IPayment> payments;

    @Autowired
    public PaymentService(Map<String, IPayment> payments) {
        this.payments = payments;
    }

    public double pay(Reservation reservation, Map<String, String> paymentData) throws Exception {
        IPayment paymentMethod = payments.get(paymentData.get("type"));

        if (paymentMethod == null) 
            throw new ValidationException("Neplatný způsob platby.");

        return paymentMethod.pay(reservation, paymentData);
    }
}
