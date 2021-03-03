package by.belotskiy.chat.creator;

import by.belotskiy.chat.entity.Message;
import by.belotskiy.chat.util.IdProvider;

public class MessageCreator {

    public static Message createMessage(String message, String username){
        int id = IdProvider.nextId();
        return new Message(id, message, username, false);
    }

    public static Message createAnswer(){
        return new Message(0, "", "", true);
    }
}
