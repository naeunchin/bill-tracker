package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.Bill;
import com.example.demo.repository.BillRepository;

@RestController
@RequestMapping("/restapi/bills")
@CrossOrigin
public class BillController {
    private final BillRepository billRepository;

    public BillController(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billRepository.findAll());
    }

    // Get bills by ID
    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        Optional<Bill> bill = billRepository.findById(id);

        return bill.map(ResponseEntity::ok)s
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@Valid @RequestBody Bill newBill) {
        newBill.setUsername("User");

        Bill savedBill = billRepository.save(newBill);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBill);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id, @Valid @RequestBody Bill updatedBill) {
        return billRepository.findById(id).map(existingBill -> {
            existingBill.setPayeeName(updatedBill.getPayeeName());
            existingBill.setPaymentDue(updatedBill.getPaymentDue());
            existingBill.setDueDate(updatedBill.getDueDate());
            existingBill.setPaid(updatedBill.isPaid());

            Bill saved = billRepository.save(existingBill);
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        return billRepository.findById(id).map(existingBill -> {
            billRepository.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
