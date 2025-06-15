package com.soapsoap;

import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.jws.soap.SOAPBinding.Style;
//Service Endpoint Interface


@WebService // oznaczenie klasy jako SEO (Service EndpointInterface)
@SOAPBinding(style = Style.RPC)
public interface MyFirstSOAPInterface {
    @WebMethod
    String getHelloWorldAsString(String name);

    @WebMethod
    long getDaysBetweenDates(String date1, String date2);
}