package com.salon.backend.repository;

import com.salon.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Explicit fetch-join so `allocations` (a LAZY @OneToMany) is actually
    // populated before the transaction/session closes - without this, it
    // would silently serialize as an empty list even when real allocation
    // rows exist, since open-in-view is off and nothing else in the normal
    // findAll()/findById() path touches the collection.
    @Query("select distinct p from Product p left join fetch p.allocations")
    List<Product> findAllWithAllocations();

    @Query("select p from Product p left join fetch p.allocations where p.id = :id")
    Optional<Product> findByIdWithAllocations(UUID id);
}
