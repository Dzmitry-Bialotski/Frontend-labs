package by.belotskiy.chat.entity;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

public class User {

    private String username;

    private InetAddress IP;

    private int port;

    private int friendPort;

    private final List<Message> messages = new ArrayList<>();

    public User(String username, int port, int friendPort) throws UnknownHostException {
        this.username = username;
        IP = InetAddress.getByName("127.0.0.1");
        this.port = port;
        this.friendPort = friendPort;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void addMessage(Message message){
        messages.add(message);
    }
    public InetAddress getIP() {
        return IP;
    }

    public void setIP(InetAddress IP) {
        this.IP = IP;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public int getFriendPort() {
        return friendPort;
    }

    public void setFriendPort(int friendPort) {
        this.friendPort = friendPort;
    }
}
