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

    // Get all bills: ActiveStudent sees only their bills, Accounting sees all bills
    @GetMapping
    @RolesAllowed({"ActiveStudent", "Accounting"})
    public ResponseEntity<List<Bill>> getAllBills(JwtAuthenticationToken auth, @AuthenticationPrincipal Jwt jwt) {
        boolean isAccounting = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_Accounting"));

        if (isAccounting) {
            return ResponseEntity.ok(billRepository.findAll());
        } else {
            String username = jwt.getClaimAsString("preferred_username");
            return ResponseEntity.ok(billRepository.findByUsername(username));
        }
    }

    // Get bills by ID: must belong to the authenticated user
    @GetMapping("/{id}")
    @RolesAllowed("ActiveStudent")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        Optional<Bill> bill = billRepository.findById(id);

        return bill.map(foundBill -> {
            if (foundBill.getUsername() != null && !foundBill.getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).<Bill>build();
            }
            return ResponseEntity.ok(foundBill);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @RolesAllowed("ActiveStudent")
    public ResponseEntity<Bill> createBill(@Valid @RequestBody Bill newBill, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        newBill.setUsername(username);

        Bill savedBill = billRepository.save(newBill);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBill);
    }

    @PutMapping("/{id}")
    @RolesAllowed("ActiveStudent")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id, @Valid @RequestBody Bill updatedBill, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");

        return billRepository.findById(id).map(existingBill -> {
            if (existingBill.getUsername() != null && !existingBill.getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).<Bill>build();
            }

            existingBill.setPayeeName(updatedBill.getPayeeName());
            existingBill.setPaymentDue(updatedBill.getPaymentDue());
            existingBill.setDueDate(updatedBill.getDueDate());
            existingBill.setPaid(updatedBill.isPaid());

            Bill saved = billRepository.save(existingBill);
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @RolesAllowed("ActiveStudent")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");

        return billRepository.findById(id).map(existingBill -> {
            if (existingBill.getUsername() != null && !existingBill.getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build();
            }

            billRepository.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
