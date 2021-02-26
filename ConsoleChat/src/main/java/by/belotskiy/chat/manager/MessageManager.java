package by.belotskiy.chat.manager;

import by.belotskiy.chat.creator.MessageCreator;
import by.belotskiy.chat.entity.Message;
import by.belotskiy.chat.entity.User;
import by.belotskiy.chat.printer.MessagePrinter;
import by.belotskiy.chat.util.IdProvider;
import by.belotskiy.chat.util.MessageSerializer;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;
import java.util.Scanner;

public class MessageManager {

    private final User user;

    DatagramSocket datagramSocket;

    private static boolean userMessageIsLost = false;

    public MessageManager(User user) throws SocketException {
        this.user = user;
        datagramSocket = new DatagramSocket(user.getFriendPort());
    }

    public void receiveMessages() {
        while (true){
            byte[] receiveBuffer = new byte[1024];
            DatagramPacket receivePacket = new DatagramPacket(receiveBuffer, receiveBuffer.length);
            Message message = null;
            try {
                datagramSocket.receive(receivePacket);
                message = MessageSerializer.deserialize(receivePacket.getData());
            } catch (IOException | ClassNotFoundException e) {
                e.printStackTrace();
            }
            if(!message.isAnswer()){
                user.addMessage(message);
                MessagePrinter.printChat(user);
                IdProvider.setId(message.getId() + 1);
                // after receiving message send answer that we get message;
                Message answer = MessageCreator.createAnswer();
                answer.setAnswer(true);
                try {
                    byte[] answerData = MessageSerializer.serialize(answer);
                    DatagramPacket sendPacket = new DatagramPacket(answerData, answerData.length,
                            user.getIP(), user.getPort());
                    datagramSocket.send(sendPacket);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }else{
                userMessageIsLost = false;
            }
        }
    }

    public void sendMessage(Scanner in) {
        while (true){
            MessagePrinter.printChat(user);
            String messageText = in.nextLine();
            Message message = MessageCreator.createMessage(messageText, user.getUsername());
            user.addMessage(message);
            try {
                userMessageIsLost = true;
                while (userMessageIsLost){
                    byte[] messageData = MessageSerializer.serialize(message);
                    DatagramPacket sendPacket = new DatagramPacket(messageData, messageData.length,
                            user.getIP(), user.getPort());
                    datagramSocket.send(sendPacket);
                    Thread.sleep(1000);
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
