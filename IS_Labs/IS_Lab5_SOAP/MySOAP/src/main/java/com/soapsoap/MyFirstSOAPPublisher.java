package com.soapsoap;

import javax.xml.ws.Endpoint;
import com.soapsoap.MyFirstSOAPInterface;


//Endpoint publisher
public class MyFirstSOAPPublisher{
    public static void main(String[] args) {
        Endpoint.publish("http://localhost:7779/ws/first",
                new MyFirstWS());
    }
}