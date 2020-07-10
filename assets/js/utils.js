GenderInequality.Utils = (function () {
    function get_color_for_gender(gender) {
        if (gender === "Female") {
            return "#F39A59";
        } else {
            return "#1FC3AA";
        }
    }

    var colorGradient = ["#fff5f0", "#fff4ee", "#fff2ec",
                         "#fff2eb", "#fff0e9", "#ffefe7", 
                         "#ffeee6", "#ffede5", "#ffece3", 
                         "#fdd5c4", "#fdd3c1", "#fdd1bf", 
                         "#fdd0bd", "#fdceba", "#fdccb7", 
                         "#fdcbb6", "#fdc8b3", "#fdc6b0", 
                         "#fcb398", "#fcb095", "#fcae92", 
                         "#fca689", "#fca486", "#fca183", 
                         "#fca082", "#fc9d7f", "#fc9b7c", 
                         "#fc9374", "#fc9071", "#fc8e6f", 
                         "#fc8d6d", "#fc8a6b", "#fc8868",  
                         "#fa7354", "#fa7052", "#fa6e50", 
                         "#fa6c4e", "#f96a4c", "#f9674a", 
                         "#f75e44", "#f75c42", "#f65940", 
                         "#f6573f", "#f5553d", "#f4523b", 
                         "#e23028", "#e02e27", "#de2c26", 
                         "#dd2b25", "#db2924", "#d92723", 
                         "#d22121", "#d01f20", "#cd1e1f", 
                         "#cc1d1f", "#ca1c1e", "#c71b1d", 
                         "#c61a1d", "#c4191c", "#c2181c", 
                         "#c0171b", "#be161b", "#bb151a", 
                         "#ba151a", "#b81419", "#b51319"];

    return {
        get_color_for_gender, get_color_for_gender,
        colorGradient, colorGradient
    }
}());