package org.islabs;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.stream.Collectors;

public class APIClient {
    private String urlString;

    public APIClient(String urlString) {
        this.urlString = urlString;
    }

    public String fetchData() throws Exception {
        URL url = new URL(urlString);
        System.out.println("Sending request...");
        InputStream is = url.openStream();
        System.out.println("Receiving response...");
        String source = new BufferedReader(new InputStreamReader(is))
                .lines()
                .collect(Collectors.joining("\n"));
        return source;
    }
}