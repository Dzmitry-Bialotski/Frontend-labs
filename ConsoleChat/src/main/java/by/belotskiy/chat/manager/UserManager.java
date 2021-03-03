package by.belotskiy.chat.manager;

import by.belotskiy.chat.entity.User;
import by.belotskiy.chat.printer.MessagePrinter;

import java.net.UnknownHostException;
import java.util.Scanner;

public class UserManager {

    public static User prepareUser(Scanner in) throws UnknownHostException {
        MessagePrinter.printWelcomeMessage();
        String username;
        int port, friendPort;
        username = in.nextLine();
        System.out.print("Print your port number: ");
        port = Integer.parseInt(in.nextLine());
        System.out.print("Print your friend`s port number: ");
        friendPort = Integer.parseInt(in.nextLine());
        User user = new User(username, port, friendPort);
        return user;
    }
}
