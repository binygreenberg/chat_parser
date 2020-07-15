/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export function createChart(data) {
  /* Chart code */
// Themes begin
//   am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
  let chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.data = data

  var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.dataFields.category = "key";
  categoryAxis.renderer.minGridDistance = 1;
  categoryAxis.renderer.inversed = true;
  categoryAxis.renderer.grid.template.disabled = true;
  categoryAxis.renderer.labels.template.disabled = true;

  var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;

  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.categoryY = "key";
  series.dataFields.valueX = "value";
  series.columns.template.strokeOpacity = 0;
  series.columns.template.column.cornerRadiusBottomRight = 5;
  series.columns.template.column.cornerRadiusTopRight = 5;
  series.columns.template.tooltipText = "{valueX}: [bold]{categoryY}[/b]";

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
  series.columns.template.adapter.add("fill", function(fill, target){
    return chart.colors.getIndex(target.dataItem.index);
  });

  categoryAxis.sortBySeries = series;

  // chart.maskBullets = false;
// Add bullets
  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.text = "{categoryY}";
  labelBullet.label.fontSize = 40;
  labelBullet.filters.push(new am4core.DropShadowFilter())
}
