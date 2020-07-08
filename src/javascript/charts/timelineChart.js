/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {getCorrectDateFormat} from "../analyze";


/* Chart code */
export function createChart(data, dateFormat) {
// Themes begin
  am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
  let chart = am4core.create("linechartdiv", am4charts.XYChart);

// Add data
  chart.data = data

// Set input format for the dates
  chart.dateFormatter.inputDateFormat = dateFormat;

  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.tooltipDateFormat = "d MMMM";

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;
  valueAxis.title.text = "# of Messages";

  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.dateX = "date";
  series.dataFields.valueY = "value";
  series.tooltipText = "Message: [bold]{valueY}[/]";
  series.strokeWidth = 2;
  series.minBulletDistance = 15;
  series.fillOpacity = 0.2

// Make bullets grow on hover
  var bullet = series.bullets.push(new am4charts.CircleBullet());
  bullet.circle.strokeWidth = 2;
  bullet.circle.radius = 4;
  bullet.circle.fill = am4core.color("#fff");

  var bullethover = bullet.states.create("hover");
  bullethover.properties.scale = 1.3;

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.lineY.opacity = 0;
  chart.scrollbarX = new am4charts.XYChartScrollbar();
  chart.scrollbarX.series.push(series);

  dateAxis.keepSelection = true;

}
