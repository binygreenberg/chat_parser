/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {getCorrectDateFormat} from "../analyze";


/* Chart code */
export function createChart(data, dateFormat) {

// Create chart instance
  let chart = am4core.create("linechartdiv", am4charts.XYChart);
  chart.paddingRight = 40;
// Set input format for the dates
  chart.dateFormatter.inputDateFormat = dateFormat;

// Add data
  chart.data = data

// Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;
  dateAxis.groupData = true;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = "value";
  series.dataFields.dateX = "key";
  series.tooltipText = "{value}"

  series.tooltip.pointerOrientation = "vertical";

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.snapToSeries = series;
  chart.cursor.xAxis = dateAxis;

  chart.scrollbarX = new am4core.Scrollbar();
}
