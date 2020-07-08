/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/* Chart code */
// Themes begin
export function createChart(data) {
  am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
  let chart = am4core.create("piechartdiv", am4charts.PieChart);

  // Set the data
  chart.data = data;

// Add and configure Series
  let pieSeries = chart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.category = "key";
  pieSeries.dataFields.value = "value";

// Let's cut a hole in our Pie chart the size of 30% the radius
  chart.innerRadius = am4core.percent(30);

  pieSeries.alignLabels = false;

  pieSeries.ticks.template.events.on("ready", hideSmall);
  pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
  pieSeries.labels.template.events.on("ready", hideSmall);
  pieSeries.labels.template.events.on("visibilitychanged", hideSmall);

  function hideSmall(ev) {
    if (ev.target.dataItem.values.value.percent < 5) {
      ev.target.hide();
    }
    else {
      ev.target.show();
    }
  }

  // chart.legend = new am4charts.Legend();
  // chart.legend.position = "right";
}
