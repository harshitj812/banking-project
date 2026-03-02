package com.bank.transaction.controller;

import com.bank.transaction.model.Transaction;
import com.bank.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    @Autowired
    private TransactionRepository repository;

    @Autowired
    private com.bank.transaction.service.TransactionService txService;

    @GetMapping
    public List<Transaction> all() {
        return repository.findAll();
    }

    @GetMapping("/account/{id}")
    public List<Transaction> history(@PathVariable Long id) {
        return repository.findByFromAccountIdOrToAccountId(id, id);
    }

    /**
     * process a transaction (deposit/withdrawal)
     */
    @PostMapping
    public Transaction create(@RequestBody Transaction tx) {
        return txService.process(tx);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
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