package com.lg;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.List;


public class Main {
    public static void main(String[] args){
        System.out.println("JPA project");

        EntityManagerFactory factory = Persistence.createEntityManagerFactory("Hibernate_JPA");

        EntityManager em = factory.createEntityManager();

        try {
            initUsersRoles(em);

            updateUserPassword(em);

            deleteRole(em);

            findUsersByLastName(em);

        } finally {
            em.close();
        }

        factory.close();
    }


    static void initUsersRoles(EntityManager em){
        em.getTransaction().begin();

        // Create and persist Roles
        Role adminRole = new Role("ADMIN");
        Role userRole = new Role("USER");
        Role managerRole = new Role("MANAGER");
        Role guestRole = new Role("GUEST");
        Role moderatorRole = new Role("MODERATOR");

        em.persist(adminRole);
        em.persist(userRole);
        em.persist(managerRole);
        em.persist(guestRole);
        em.persist(moderatorRole);

        // Create and persist Users
        User user1 = new User("johndoe", "password123", "John", "Doe", Sex.MALE);
        user1.getRoles().add(adminRole);  // Assigning roles to user
        user1.getRoles().add(userRole);

        User user2 = new User("janedoe", "password456", "Jane", "Doe", Sex.AI);
        user2.getRoles().add(userRole);

        User user3 = new User("michaelsmith", "password789", "Michael", "Smith", Sex.MALE);
        user3.getRoles().add(managerRole);

        User user4 = new User("maryjane", "password321", "Mary", "Jane", Sex.FEMALE);
        user4.getRoles().add(guestRole);

        User user5 = new User("tomjones", "password654", "Tom", "Jones", Sex.AI);
        user5.getRoles().add(moderatorRole);

        // Persisting users
        em.persist(user1);
        em.persist(user2);
        em.persist(user3);
        em.persist(user4);
        em.persist(user5);

        em.getTransaction().commit();
    }
    static void updateUserPassword(EntityManager em) {
        try {
            // Begin transaction
            EntityTransaction transaction = em.getTransaction();
            transaction.begin();

            // Find the User with id = 1
            User user = em.find(User.class, 1L);

            if (user != null) {
                // Update the user's password
                user.setPassword("newPassword123");

                // Merge the updated user back into the persistence context
                em.merge(user);

                System.out.println("User's password updated successfully.");
            } else {
                System.out.println("User with id 1 not found.");
            }

            // Commit transaction
            transaction.commit();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    static void deleteRole(EntityManager em) {
        try {
            // Begin transaction
            EntityTransaction transaction = em.getTransaction();
            transaction.begin();

            // Find the Role with id = 5
            Role role = em.find(Role.class, 5L);

            if (role != null) {
                // Remove the role from the database
                em.remove(role);

                System.out.println("Role with id 5 deleted successfully.");
            } else {
                System.out.println("Role with id 5 not found.");
            }

            // Commit transaction
            transaction.commit();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    static void findUsersByLastName(EntityManager em) {
        try {
            // Create the JPQL query
            String jpql = "SELECT u FROM User u WHERE u.lastName = :lastName";
            List<User> users = em.createQuery(jpql, User.class)
                    .setParameter("lastName", "Kowalski")
                    .getResultList();

            // Display the results
            System.out.println("Users with last name 'Kowalski':");
            for (User user : users) {
                System.out.println(user.getFirstName() + " " + user.getLastName());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
