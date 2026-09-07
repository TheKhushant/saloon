package com.salon.backend.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    /**
     * Without this, serializing a JPA entity with an uninitialized lazy
     * association (e.g. Barber.branch, Booking.customer) after the
     * Hibernate session has closed (spring.jpa.open-in-view: false, by
     * design - see application.yml) throws LazyInitializationException and
     * turns the request into a 500. This module tells Jackson to just
     * serialize an uninitialized lazy property as absent/null instead of
     * trying to force-load it - it does NOT fetch the data, so any field
     * a frontend actually needs from a relation should be pulled via an
     * explicit query/join or a flat shadow field (see Barber.branchId,
     * Customer.branchId) rather than relying on this to lazily populate it.
     */
    @Bean
    public Hibernate6Module hibernate6Module() {
        Hibernate6Module module = new Hibernate6Module();
        module.disable(Hibernate6Module.Feature.FORCE_LAZY_LOADING);
        return module;
    }
}
