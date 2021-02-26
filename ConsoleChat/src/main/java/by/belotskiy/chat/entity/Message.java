package by.belotskiy.chat.entity;

import java.io.Serializable;
import java.util.Date;

public class Message implements Serializable {

    private int id;

    private String message;

    private boolean isAnswer;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    private String username;

    private Date date;

    public Message(int id, String message, String username, boolean isAnswer) {
        this.id = id;
        this.message = message;
        this.date = new Date();
        this.username = username;
        this.isAnswer = isAnswer;
    }

    public int getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDate() {
        return date;
    }

    public boolean isAnswer() {
        return isAnswer;
    }

    public void setAnswer(boolean answer) {
        isAnswer = answer;
    }
}
