package by.belotskiy.chat.util;

public class IdProvider {

    private static int _id = 1;

    public static int nextId(){
        return _id++;
    }

    public static void setId(int id){
        _id = id;
    }

}
