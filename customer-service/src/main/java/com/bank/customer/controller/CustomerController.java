package com.bank.customer.controller;

import com.bank.customer.model.Customer;
import com.bank.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository repository;

    @GetMapping
    public List<Customer> all() {
        return repository.findAll();
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        customer.setBalance(java.math.BigDecimal.ZERO);
        return repository.save(customer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable Long id, @RequestBody Customer cust) {
        return repository.findById(id)
                .map(c -> {
                    c.setName(cust.getName());
                    c.setEmail(cust.getEmail());
                    if (cust.getBalance() != null) {
                        c.setBalance(cust.getBalance());
                    }
                    repository.save(c);
                    return ResponseEntity.ok(c);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}