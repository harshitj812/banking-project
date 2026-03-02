package com.bank.transaction.service;

import com.bank.transaction.model.Transaction;
import com.bank.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String CUSTOMER_URL = "http://localhost:8081/api/customers/";

    public Transaction process(Transaction tx) {
        BigDecimal amount = tx.getAmount();
        if (amount == null) {
            throw new RuntimeException("Amount is required");
        }
        if (tx.getType() == null) {
            throw new RuntimeException("Type is required");
        }

        switch (tx.getType()) {
            case "DEPOSIT":
                applyToAccount(tx.getToAccountId(), amount);
                break;
            case "WITHDRAWAL":
                applyToAccount(tx.getFromAccountId(), amount.negate());
                break;
            case "TRANSFER":
                if (tx.getFromAccountId() == null || tx.getToAccountId() == null) {
                    throw new RuntimeException("Transfer requires fromAccountId and toAccountId");
                }
                applyToAccount(tx.getFromAccountId(), amount.negate());
                applyToAccount(tx.getToAccountId(), amount);
                break;
            default:
                throw new RuntimeException("Unknown transaction type");
        }
        tx.setTimestamp(LocalDateTime.now());
        return repository.save(tx);
    }

    private void applyToAccount(Long accountId, BigDecimal delta) {
        if (accountId == null) {
            throw new RuntimeException("Account id is required");
        }
        ResponseEntity<CustomerDto> resp = restTemplate.getForEntity(CUSTOMER_URL + accountId, CustomerDto.class);
        if (!resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) {
            throw new RuntimeException("Account not found: " + accountId);
        }
        CustomerDto cust = resp.getBody();
        BigDecimal bal = cust.getBalance();
        if (bal == null) bal = BigDecimal.ZERO;
        BigDecimal newBal = bal.add(delta);
        if (newBal.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Insufficient funds for account " + accountId);
        }
        cust.setBalance(newBal);
        restTemplate.put(CUSTOMER_URL + cust.getId(), cust);
    }

    // inner DTO class to avoid dependency on customer-service jar
    public static class CustomerDto {
        private Long id;
        private String name;
        private String email;
        private BigDecimal balance;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public BigDecimal getBalance() { return balance; }
        public void setBalance(BigDecimal balance) { this.balance = balance; }
    }
}