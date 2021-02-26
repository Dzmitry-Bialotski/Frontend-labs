package by.belotskiy.chat.printer;

import by.belotskiy.chat.entity.Message;
import by.belotskiy.chat.entity.User;

import java.text.SimpleDateFormat;

public class MessagePrinter {

    private static final String ANSI_RESET = "\u001B[0m";

    private static final String ANSI_YELLOW = "\u001B[33m";

    private static final String ANSI_GREEN = "\u001B[32m";

    private static final String COLON = ": ";

    private static final String EMPTY = "";

    private static final SimpleDateFormat formatForDateNow = new SimpleDateFormat("hh:mm:ss");

    public static final void printWelcomeMessage(){
        System.out.println("Welcome to the chat!! ");
        System.out.print("Firstly, write your username: ");
    }

    public static void printMessage(Message message){
        String messageString = message.getUsername() + COLON + message.getMessage();
        String timeString = formatForDateNow.format(message.getDate());
        System.out.println(messageString);
        System.out.println(ANSI_YELLOW + timeString + ANSI_RESET);
        //System.out.println(ANSI_GREEN + message.getId() + ANSI_RESET);
        System.out.println(EMPTY);
    }

    /* I reprint all the chat every time just in case to demonstrate
        that messages are ordered correctly */
    public static void printChat(User user){
        simulateCLS();
        for(Message message : user.getMessages()){
            MessagePrinter.printMessage(message);
        }
        System.out.print(user.getUsername() + COLON);
    }

    public static void simulateCLS(){
        /* pay no attention please,
            this is the most accessible way, and the lab is not dedicated
            to the ability to draw in the console
         */
        System.out.println("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
        //new ProcessBuilder("cmd", "/c", "cls").inheritIO().start().waitFor();
    }
}
