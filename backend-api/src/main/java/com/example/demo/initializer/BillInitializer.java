package com.example.demo.initializer;

import com.example.demo.entity.Bill;
import com.example.demo.repository.BillRepository;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.logging.Logger;

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
                for (int count = 1; count <= 10; count++) {
                    Bill currentBill = Bill.of(faker);
                    // Notice we use .save() instead of .add() in Spring!
                    billRepository.save(currentBill);
                }
            } catch (Exception ex) {
                logger.warning(ex.getMessage());
            }
            logger.info("Created " + billRepository.count() + " records.");
        }
    }
}