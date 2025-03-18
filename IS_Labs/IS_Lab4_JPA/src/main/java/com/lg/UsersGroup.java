package com.lg;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;


@Entity
public class UsersGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String groupName;

    @ManyToMany(mappedBy = "groups")
    private Set<User> users = new HashSet<>();


    public UsersGroup() {}
    public UsersGroup(String groupName) {
        this.groupName = groupName;
    }


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupName() {
        return groupName;
    }
    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Set<User> getUsers() {
        return users;
    }
    public void setUsers(Set<User> users) {
        this.users = users;
    }
    public void addUser(User user) {
        this.users.add(user);
    }
}