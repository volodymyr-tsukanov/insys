package com.lg;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


public class Main {
    public static void main(String[] args){
        System.out.println("JPA project");
        EntityManagerFactory factory = Persistence.createEntityManagerFactory("Hibernate_JPA");
        EntityManager em = factory.createEntityManager();
        em.getTransaction().begin();

        User u1 = new User("test_1","test_1","Andrzej","Kowalski");
        em.persist(u1);
        em.getTransaction().commit();
        em.close();

        factory.close();
    }
}
