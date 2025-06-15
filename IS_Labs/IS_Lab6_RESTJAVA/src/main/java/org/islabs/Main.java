package org.islabs;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        try {
            List<City> cities = new ArrayList<>();

            // Set the URL to your REST API endpoint
            String temp_url = "http://127.0.0.1/gl15/insys/IS_Labs/IS_Lab6_REST/cities/read/10-20";
            String[] splitString = temp_url.split("/");
            if(splitString[splitString.length-1].contains("-")){    //range
                System.out.println("Fetching data...");
                String[] rngS = splitString[splitString.length-1].split("-");
                int start = Integer.parseInt(rngS[0]), end = Integer.parseInt(rngS[1]);

                while(start<=end){
                    APIClient client = new APIClient(temp_url.substring(0,temp_url.length()-5)+start);
                    String source = client.fetchData();

                    JSONObject json = new JSONObject(source);
                    JSONArray jsonCities = json.getJSONArray("cities");
                    for (int i = 0; i < jsonCities.length(); i++) {
                        JSONObject cityJson = jsonCities.getJSONObject(i);
                        City city = new City(cityJson);
                        cities.add(city);
                    }
                    start++;
                }

                System.out.println("Processing data...");
            }else{
                APIClient client = new APIClient(temp_url);

                System.out.println("Fetching data...");
                String source = client.fetchData();

                System.out.println("Processing data...");
                JSONObject json = new JSONObject(source);
                JSONArray jsonCities = json.getJSONArray("cities");
                for (int i = 0; i < jsonCities.length(); i++) {
                    JSONObject cityJson = jsonCities.getJSONObject(i);
                    City city = new City(cityJson);
                    cities.add(city);
                }
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