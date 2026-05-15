package com.example.demo.initializer;

import com.example.demo.entity.Bill;
import com.example.demo.repository.BillRepository;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.logging.Logger;
import java.util.Random;

@Component
public class BillInitializer implements CommandLineRunner {
    private final Logger logger = Logger.getLogger(BillInitializer.class.getName());

    private final BillRepository billRepository;

    public BillInitializer(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing bills...");

        if (billRepository.count() == 0) {
            try {
                Faker faker = new Faker();
                // Using real LDAP users (2 ActiveStudent s) so they can be tested via Keycloak
                String[] usernames = {"nchin1", "j1"};
                Random random = new Random();

                for (int count = 1; count <= 10; count++) {
                    Bill currentBill = Bill.of(faker);

                    String randomUser = usernames[random.nextInt(usernames.length)];
                    currentBill.setUsername(randomUser);
                    billRepository.save(currentBill);
                }
            } catch (Exception ex) {
                logger.warning(ex.getMessage());
            }
            logger.info("Created " + billRepository.count() + " records.");
        }
    }
}