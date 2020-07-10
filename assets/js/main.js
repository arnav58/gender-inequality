$(document).ready(function(){
    GenderInequality.EmploymentBySectorChart.init_chart();
    GenderInequality.GenderWageGapChart.init_chart();

    $("#employmentBySector .region-select").change(function(){
        GenderInequality.EmploymentBySectorChart.redraw_chart();
    });

    $("#employmentBySector .sector-select").change(function(){
        GenderInequality.EmploymentBySectorChart.redraw_chart();
    });

    $("#wageGap .reset-chart-btn").click(function(){
        GenderInequality.GenderWageGapChart.redraw_chart();
    });

    $(".page-controls .navigate").click(function(){
        $(".viz-container").hide();
        $("#"+$(this).attr("data-to")).fadeIn(500);
        $("body").scrollTop(0);
    });
});