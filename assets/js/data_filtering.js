// Creating a namespace
window.GenderInequality = window.GenderInequality || {};

// Adding a filterData package to the namespace containing functions to filter the datasets based on user selections
GenderInequality.filterData = (function(){

    // Function to get filtered employment by sector data based on region and sector
    function get_filtered_employment_data(region, sector) {
        var filtered_employment_data = $employment_by_sector_data.filter(function(entry){ return entry.Region === region && entry.Sector === sector; });

        return filtered_employment_data;
    }

    // Function to get a list of filtered country names available for each region and sector selection
    function get_filtered_employment_country_names(region, sector) {
        var filtered_employment_data = get_filtered_employment_data(region, sector);

        var uniqueCountryNames = [];
        for(i = 0; i< filtered_employment_data.length; i++){    
            if(uniqueCountryNames.indexOf(filtered_employment_data[i]["Country"]) === -1){
                uniqueCountryNames.push(filtered_employment_data[i]["Country"]);        
            }        
        }

        return uniqueCountryNames;
    }

    // Function to get filtered gender wage gap data
    function get_filtered_gender_wage_gap_data(country="") {
        if (country === "") {
            var filtered_gender_wage_gap_data = $wage_gap_by_gender_data.filter(function(entry){ return entry.Occupation === "All occupations" });
        }
        else {
            var filtered_gender_wage_gap_data = $wage_gap_by_gender_data.filter(function(entry){ return entry.Country == country });
        }

        return filtered_gender_wage_gap_data;
    }

    // Function to get filtered employment by sector data based on region and sector
    function get_filtered_women_in_parliament_value(country_id) {
        var filtered_women_in_parliament_data = $women_in_parliament_data.filter(function(entry){ return entry.id === country_id; });

        if (filtered_women_in_parliament_data.length > 1) {
            console.log(country_id);
        } else if (filtered_women_in_parliament_data.length === 1) {
            return filtered_women_in_parliament_data[0]["Value"];
        } else {
            return 0;
        }
    }

    // Bundling all functions and exposing them as package end-points
    return {
        get_filtered_employment_data: get_filtered_employment_data,
        get_filtered_employment_country_names: get_filtered_employment_country_names,
        get_filtered_gender_wage_gap_data: get_filtered_gender_wage_gap_data,
        get_filtered_women_in_parliament_value: get_filtered_women_in_parliament_value
    }
}());