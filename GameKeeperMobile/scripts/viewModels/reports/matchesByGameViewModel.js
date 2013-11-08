﻿define(["viewModels/chooseGameViewModel", "azure-client"], function (chooseGameDialog, azureClient) {
    "use strict";

    var lineChart = null;

    var drawChart = function (datesPlayed) {
        var $lineChart;
        if (lineChart !== null) {
            lineChart.destroy();
        }

        $lineChart = $("#game-popularity-line-chart").empty();
        $lineChart.kendoChart({
            renderAs: "svg",
            dataSource: {
                data: datesPlayed,
                schema: {
                    model: {
                        fields: {
                            DateCreated: {
                                type: 'date'
                            }
                        }
                    }
                }
            },
            title: {
                position: "top",
                text: "Times Played"
            },
            legend: {
                position: "bottom"
            },
            series: [
                {
                    type: "line",
                    name: "Times Played",
                    categoryField: 'DateCreated',
                    field: 'DateCreated',
                    aggregate: "count",
                    color: "#016C97"
                }
            ],
            categoryAxis: {
                field: 'DateCreated',
                baseUnit: "months",
                labels: {
                    rotation: 90
                }
            }
        });

        lineChart = $lineChart.data("kendoChart");
    };

    var datesPlayed;

    var vm = kendo.observable({
        show: function () {
            chooseGameDialog.show(null, { displayLinks: "#matches-by-game" });
        },
        onShow: function (e) {
            var gameId = parseInt(e.view.params.gameId, 10);
            azureClient.invokeApi('matchesbygame', { method: 'get', parameters: { gameid: gameId } }).done(function (result) {
                datesPlayed = JSON.parse(result.response);
                drawChart(datesPlayed);
            });
        },
        onHide: function () {
            $(lineChart.element).empty();
            lineChart.destroy();
        }
    });
    return vm;
});