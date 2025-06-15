package com.lg;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "users", indexes = {@Index(name = "login_index", columnList = "login")})  // Add index on login column
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String login;
    private String password;
    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Sex sex;

    // One-to-many relationship with Role
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private final List<Role> roles = new ArrayList<>();

    // Many-to-many relationship with UsersGroup
    @ManyToMany
    @JoinTable(
            name = "user_groups",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    private final Set<UsersGroup> groups = new HashSet<>();

    // Default constructor
    public User() {}

    // Constructor with fields
    public User(String login, String password, String firstName, String lastName, Sex sex) {
        this.login = login;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
    }

    // Getter and setter methods
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Sex getSex() {
        return sex;
    }
    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public List<Role> getRoles() {
        return roles;
    }
    public void setRoles(List<Role> roles) {
        this.roles.clear();
        this.roles.addAll(roles);
    }

    // Method to add a role to the user
    public void addRole(Role role) {
        this.roles.add(role);
    }
    public Set<UsersGroup> getGroups() {
        return groups;
    }

    public void setGroups(Set<UsersGroup> groups) {
        this.groups.clear();
        this.groups.addAll(groups);
    }
    public void addGroup(UsersGroup group) {
        this.groups.add(group);
    }
}
