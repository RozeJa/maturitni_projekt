package cz.rozek.jan.cinema_town.servicies.paymentService;

import java.util.Map;

import cz.rozek.jan.cinema_town.models.primary.Reservation;

@FunctionalInterface
public interface IPayment {
    double pay(Reservation reservation, Map<String, String> paymentData) throws Exception;
}
