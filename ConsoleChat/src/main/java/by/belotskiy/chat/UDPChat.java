package by.belotskiy.chat;

import by.belotskiy.chat.entity.User;
import by.belotskiy.chat.manager.MessageManager;
import by.belotskiy.chat.manager.UserManager;

import java.io.IOException;
import java.util.Scanner;

public class UDPChat {

    public static MessageManager messageManager;

    public static void main(String[] args) throws IOException {
        Scanner in = new Scanner(System.in);
        User user = UserManager.prepareUser(in);
        messageManager = new MessageManager(user);

        new Thread(() -> messageManager.receiveMessages()).start();
        new Thread(() -> messageManager.sendMessage(in)).start();
    }
}
