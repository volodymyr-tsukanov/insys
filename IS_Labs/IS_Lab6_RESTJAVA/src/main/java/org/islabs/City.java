package org.islabs;
import org.json.JSONObject;


public class City {
    private int id;
    private String name;
    private String countryCode;
    private String district;
    private int population;

    // Construct from a JSONObject
    public City(JSONObject json) {
        // We assume the JSON keys match the database columns
        this.id = json.getInt("ID");
        this.name = json.getString("Name");
        this.countryCode = json.getString("CountryCode");
        this.district = json.getString("District");
        this.population = json.getInt("Population");
    }

    // Getters for fields (if needed)
    public int getId() { return id; }
    public String getName() { return name; }
    public String getCountryCode() { return countryCode; }
    public String getDistrict() { return district; }
    public int getPopulation() { return population; }

    // Custom presentation method to show city data in a friendly format
    public String toFormattedString() {
        return "City ID: " + id + "\n"
                + "City Name: " + name + "\n"
                + "Country Code: " + countryCode + "\n"
                + "District: " + district + "\n"
                + "Population: " + population + "\n";
    }
}