package org.islabs;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        try {
            // Set the URL to your REST API endpoint
            String temp_url = "http://127.0.0.1/gl15/insys/IS_Labs/IS_Lab6_REST/cities/read/10";
            APIClient client = new APIClient(temp_url);

            System.out.println("Fetching data...");
            String source = client.fetchData();

            System.out.println("Processing data...");
            JSONObject json = new JSONObject(source);
            JSONArray jsonCities = json.getJSONArray("cities");

            // Create a list to store the parsed City objects
            List<City> cities = new ArrayList<>();
            for (int i = 0; i < jsonCities.length(); i++) {
                JSONObject cityJson = jsonCities.getJSONObject(i);
                City city = new City(cityJson);
                cities.add(city);
            }

            // Display friendly output for each City retrieved from the JSON array
            if(cities.isEmpty()){
                System.out.println("No cities found.");
            } else {
                System.out.println("City Data:");
                for (City city : cities) {
                    System.out.println("------------------------------");
                    System.out.println(city.toFormattedString());
                }
            }
        } catch (Exception e) {
            System.err.println("An unexpected error occurred!");
            e.printStackTrace(System.err);
        }
    }
}