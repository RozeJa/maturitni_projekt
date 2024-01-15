package cz.rozek.jan.cinema_town.servicies.paymentService;

import java.util.Map;

import cz.rozek.jan.cinema_town.models.dynamic.Reservation;

public interface IPayment {
    void pay(Reservation reservation, Map<String, String> paymentData, String accessJWT) throws Exception;
}
