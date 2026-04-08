(function () {
    var MAP_DATA = {
        "random-32-32-20": {
            labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 128],
            sr: {
                "HI-MAPF": [100, 100, 100, 100, 100, 100, 100, 100, 95, 85, 0],
                "MAPF-GPT-2M": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 90],
                "DCC": [100, 100, 100, 95, 90, 70, 60, 60, 30, 40, 0],
                "EPH": [100, 95, 100, 100, 95, 95, 65, 70, 25, 50, 5],
                "SCRIMP": [100, 100, 100, 95, 100, 90, 90, 80, 60, 60, 70]
            },
            ms: {
                "HI-MAPF": [50.5, 56, 55.5, 107, 61.4, 128.2, 65.5, 71.8, 82.8, 76.5, null],
                "MAPF-GPT-2M": [49.2, 53.8, 53.9, 57.2, 58.9, 63, 68.2, 72.9, 70, 77, 94.1],
                "DCC": [49.1, 58, 59.5, 72.8, 81.7, 92, 104.5, 111.7, 117.8, 117.5, 127],
                "EPH": [47.6, 62.5, 62, 64.5, 79, 88.7, 110.7, 108.9, 123.8, 121, 127.5],
                "SCRIMP": [48, 50.5, 52.4, 58, 56.8, 71.4, 70.5, 83.8, 96.9, 97.2, 96.6]
            },
            iu: {
                "HI-MAPF": [3.6, 18.8, 66.3, 48.8, 221.4, 214.2, 2158.2, 1405.5, 1950.7, 3693.9, null],
                "MAPF-GPT-2M": [510.8, 2571.8, 5410.6, 10023.4, 16817.5, 25789.6, 37317.4, 52094.2, 65378, 84993.4, 167878.4],
                "DCC": [26.1, 211.2, 696.2, 1407, 3356.1, 6337.2, 10385, 17196.1, 29474.4, 37877.7, 94612.2],
                "EPH": [19.7, 204.2, 576.8, 1403, 3183.2, 6155.1, 11735.3, 20330.8, 36040.6, 41383.7, 129548.7],
                "SCRIMP": [262.2, 565.2, 884.8, 1377.7, 1645.2, 2822.8, 3158.8, 4660.8, 6292.6, 6982.9, 8615.5]
            }
        },
        "random-64-64-20": {
            labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 128],
            sr: {
                "HI-MAPF": [100, 100, 100, 100, 100, 100, 100, 100, 95, 90, 5],
                "MAPF-GPT-2M": [100, 100, 100, 100, 100, 85, 95, 95, 75, 75, 55],
                "DCC": [100, 100, 90, 100, 85, 65, 50, 20, 60, 25, 0],
                "EPH": [95, 100, 100, 100, 100, 95, 85, 90, 80, 45, 15],
                "SCRIMP": [50, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            ms: {
                "HI-MAPF": [108, 115.6, 118.2, 122.6, 124, 130.2, 128.2, 128.7, 130.4, 130.1, 132],
                "MAPF-GPT-2M": [99.6, 110.2, 111.7, 112.7, 115.2, 117.7, 118.7, 121, 121.3, 123.8, 126.2],
                "DCC": [97.7, 107.8, 112.2, 112.8, 116.8, 120.8, 123.5, 126.8, 124.6, 127.2, 128],
                "EPH": [97.3, 105.7, 109.5, 112.3, 113.8, 116.1, 120.8, 120.2, 122.2, 125.3, 127.7],
                "SCRIMP": [112.5, 126.5, 126.7, 128, 128, 128, 128, 128, 128, 128, 128]
            },
            iu: {
                "HI-MAPF": [0.9, 6.2, 23.4, 45, 109.8, 110.8, 183, 211.9, 243.6, 472.9, 530],
                "MAPF-GPT-2M": [314.8, 1432.2, 3440.9, 6165.6, 9882.4, 14413.4, 20501.5, 26414.2, 34021.6, 42306.8, 70208.3],
                "DCC": [10.6, 59.4, 172.2, 382.4, 889.7, 1258, 1823.1, 2947.4, 4095.8, 6134.2, 13053],
                "EPH": [7.8, 47.8, 141.8, 328.9, 638, 964.6, 1640.2, 2520.7, 3187.4, 5290, 12250.5],
                "SCRIMP": [612.1, 1382, 2190.3, 2912.6, 3668.7, 4454.6, 5275.4, 5860.5, 6649.9, 7296.5, 9213.7]
            }
        },
        den312d: {
            labels: [8, 16, 32, 64, 128],
            sr: {
                "HI-MAPF": [100, 100, 100, 100, 0],
                "MAPF-GPT-2M": [100, 100, 100, 100, 35],
                "DCC": [100, 100, 85, 90, 5],
                "EPH": [100, 100, 100, 100, 90],
                "SCRIMP": [20, 0, 0, 0, 0]
            },
            ms: {
                "HI-MAPF": [115.3, 124, 136.7, 153.1, null],
                "MAPF-GPT-2M": [114, 120.9, 126.4, 137.8, 234],
                "DCC": [114.2, 130.7, 163.5, 190.7, 254.8],
                "EPH": [111.9, 122.2, 127, 146.1, 207.7],
                "SCRIMP": [226.2, 256, 256, 256, 256]
            },
            iu: {
                "HI-MAPF": [3.6, 21.8, 105.2, 759.9, null],
                "MAPF-GPT-2M": [300, 1464.8, 6425.6, 27326.8, 320115.9],
                "DCC": [22.6, 191.3, 1195.6, 8180.1, 112519.4],
                "EPH": [13, 128.4, 627.5, 6722.3, 77108.9],
                "SCRIMP": [1156.7, 2629.9, 5292.6, 10960.8, 14090.8]
            }
        },
        warehouse: {
            labels: [8, 16, 32, 64, 128],
            sr: {
                "HI-MAPF": [100, 100, 100, 100, 100],
                "MAPF-GPT-2M": [100, 100, 100, 100, 95],
                "DCC": [100, 100, 100, 100, 95],
                "EPH": [100, 100, 100, 100, 90],
                "SCRIMP": [0, 0, 0, 0, 0]
            },
            ms: {
                "HI-MAPF": [192.8, 215.1, 220.3, 227.6, 234.7],
                "MAPF-GPT-2M": [193.6, 214, 221.8, 229.3, 237.2],
                "DCC": [191.8, 213.3, 219.2, 227.6, 236.8],
                "EPH": [191.6, 212.9, 218.1, 227.8, 239.1],
                "SCRIMP": [256, 256, 256, 256, 256]
            },
            iu: {
                "HI-MAPF": [0.8, 1.0, 10.7, 23.6, 139.1],
                "MAPF-GPT-2M": [107, 509.6, 2303.8, 9468.8, 38508.6],
                "DCC": [4.3, 15.6, 89, 356.9, 2016.5],
                "EPH": [1.7, 11.1, 57.7, 265.1, 1502.4],
                "SCRIMP": [997.6, 1729.3, 3575.1, 7262.5, 9408.9]
            }
        }
    };

    var CHARTS = [];
    var COLORS = {
        text: "#d7e8ff",
        grid: "rgba(255, 255, 255, 0.12)",
        "HI-MAPF": "#8ec5ff",
        "MAPF-GPT-2M": "#5da8ff",
        DCC: "#ffb454",
        EPH: "#56d364",
        SCRIMP: "#ff7a59"
    };

    function dataset(mapKey, metric) {
        return Object.keys(MAP_DATA[mapKey][metric]).map(function (label) {
            return {
                label: label,
                data: MAP_DATA[mapKey][metric][label],
                borderColor: COLORS[label],
                borderWidth: label === "HI-MAPF" ? 3 : 2,
                borderDash: label === "HI-MAPF" ? [] : [6, 5],
                pointRadius: 3,
                tension: 0.12,
                spanGaps: false
            };
        });
    }

    function renderChart(canvasId, metric, yLabel, extraY) {
        var canvas = document.getElementById(canvasId);
        var mapKey = document.querySelector(".project-chart-button.is-active").getAttribute("data-map");
        var chart;

        if (!canvas || typeof Chart === "undefined") {
            return;
        }

        chart = new Chart(canvas.getContext("2d"), {
            type: "line",
            data: {
                labels: MAP_DATA[mapKey].labels,
                datasets: dataset(mapKey, metric)
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: { color: COLORS.text },
                        grid: { color: COLORS.grid },
                        title: {
                            display: true,
                            text: "Agents",
                            color: COLORS.text
                        }
                    },
                    y: Object.assign(
                        {
                            ticks: { color: COLORS.text, maxTicksLimit: 6 },
                            grid: { color: COLORS.grid },
                            title: {
                                display: true,
                                text: yLabel,
                                color: COLORS.text
                            }
                        },
                        extraY || {}
                    )
                }
            }
        });

        CHARTS.push(chart);
    }

    function drawAllCharts() {
        CHARTS.forEach(function (chart) {
            chart.destroy();
        });
        CHARTS = [];

        renderChart("himapf-sr-chart", "sr", "Success Rate (%)", { min: 0, max: 100 });
        renderChart("himapf-ms-chart", "ms", "Makespan");
        renderChart("himapf-iu-chart", "iu", "Information Units (log)", {
            type: "logarithmic",
            ticks: {
                color: COLORS.text,
                callback: function (value) {
                    if (value === 0) {
                        return "0";
                    }
                    return Number(value).toLocaleString();
                }
            }
        });
    }

    function init() {
        var buttons = document.querySelectorAll(".project-chart-button");

        if (!buttons.length || typeof Chart === "undefined") {
            return;
        }

        drawAllCharts();

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                buttons.forEach(function (item) {
                    item.classList.remove("is-active");
                });
                button.classList.add("is-active");
                drawAllCharts();
            });
        });
    }

    document.addEventListener("DOMContentLoaded", init);
})();
