/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export function createChart(data) {
  /* Chart code */
// Themes begin
  am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
  let chart = am4core.create("chartdiv", am4charts.XYChart);

  var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "key";
  categoryAxis.renderer.grid.template.disabled = true;
  categoryAxis.renderer.minGridDistance = 30;
  categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
  categoryAxis.renderer.labels.template.fontSize = 0;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.grid.template.strokeDasharray = "4,4";
  valueAxis.renderer.labels.template.disabled = true;
  valueAxis.min = 0;

// Do not crop bullets
  chart.maskBullets = false;
// Remove padding
  chart.paddingBottom = 0;

// Create series
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = "value";
  series.dataFields.categoryX = "key";
  series.columns.template.propertyFields.fill = "color";
  series.columns.template.propertyFields.stroke = "color";
  series.columns.template.column.cornerRadiusTopLeft = 15;
  series.columns.template.column.cornerRadiusTopRight = 15;
  series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/b]";
// Add bullets
  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.text = "{categoryX}";
  labelBullet.label.fontSize = 40;
  labelBullet.filters.push(new am4core.DropShadowFilter())

  chart.data = data
}
