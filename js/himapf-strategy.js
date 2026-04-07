(function () {
    var STRATEGIES = {
        yield: {
            badge: "S4.1 Yield",
            cost: "1 IU",
            label: "Local Position Yielding",
            description: "The replanning agent briefly parks in a nearby free cell, waits while the protected robot passes, and then resumes its path. This is the cheapest and most common repair tier.",
            usage: "91.8% to 99.2% of repairs, depending on map density.",
            note: "The coordinator only needs conflict timing and a nearby occupancy check."
        },
        static: {
            badge: "S4.2 Static Replan",
            cost: "|Delta c| IUs",
            label: "Bounded Static Constraint Repair",
            description: "If yielding is impossible, the conflict region is shared as a forbidden zone and the affected robot replans around it with a bounded A* call.",
            usage: "0.8% to 7.6% of observed repairs.",
            note: "This preserves decentralization while avoiding full trajectory sharing."
        },
        dynamic: {
            badge: "S4.3 Dynamic Replan",
            cost: "r IUs",
            label: "Time-Indexed Avoidance",
            description: "When a tight corridor requires timing information, the coordinator reveals a short trajectory fragment for the conflicting robot so the replanner can reason about future occupancy.",
            usage: "Less than 0.5% of repairs in the reported experiments.",
            note: "Dynamic repair is intentionally rare because it consumes more information."
        },
        joint: {
            badge: "S4.4 Joint A*",
            cost: "|A_j| * r IUs",
            label: "Coupled Local Planning",
            description: "Persistent deadlocks are handled by jointly replanning a tightly coupled subset of agents inside a bounded local window.",
            usage: "Less than 0.5% of repairs, reserved for hardest deadlocks.",
            note: "This is the most expensive tier, but it resolves narrow choke-point failures."
        }
    };

    var COLORS = {
        background: "#08111d",
        panel: "#0d1727",
        grid: "rgba(255, 255, 255, 0.16)",
        obstacle: "#2b3950",
        accent: "#0a81f7",
        accentSoft: "rgba(10, 129, 247, 0.3)",
        agentA: "#8ec5ff",
        agentB: "#ffffff",
        alert: "#ff7a59",
        warning: "#ffb454",
        bay: "#56d364",
        text: "#eef5ff",
        muted: "rgba(238, 245, 255, 0.8)"
    };

    var DEFAULT_OBSTACLES = [
        [1, 1],
        [3, 3]
    ];

    function interpolate(path, progress) {
        if (progress <= 0) {
            return path[0];
        }
        if (progress >= 1) {
            return path[path.length - 1];
        }

        var index = progress * (path.length - 1);
        var lower = Math.floor(index);
        var upper = Math.ceil(index);
        var t = index - lower;

        if (lower === upper) {
            return path[lower];
        }

        return [
            path[lower][0] + (path[upper][0] - path[lower][0]) * t,
            path[lower][1] + (path[upper][1] - path[lower][1]) * t
        ];
    }

    function getLayout(width, height, gridSize, padding) {
        var board = Math.min(width - padding * 2, height - padding * 2 - 36);
        var cell = board / gridSize;
        return {
            width: width,
            height: height,
            gridSize: gridSize,
            cell: cell,
            offsetX: (width - board) / 2,
            offsetY: (height - board) / 2 - 20
        };
    }

    function drawGrid(ctx, layout, obstacles) {
        var i;

        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;

        for (i = 0; i <= layout.gridSize; i += 1) {
            ctx.beginPath();
            ctx.moveTo(layout.offsetX + i * layout.cell, layout.offsetY);
            ctx.lineTo(layout.offsetX + i * layout.cell, layout.offsetY + layout.gridSize * layout.cell);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(layout.offsetX, layout.offsetY + i * layout.cell);
            ctx.lineTo(layout.offsetX + layout.gridSize * layout.cell, layout.offsetY + i * layout.cell);
            ctx.stroke();
        }

        ctx.fillStyle = COLORS.obstacle;
        (obstacles || DEFAULT_OBSTACLES).forEach(function (cell) {
            ctx.fillRect(
                layout.offsetX + cell[1] * layout.cell,
                layout.offsetY + cell[0] * layout.cell,
                layout.cell,
                layout.cell
            );
        });
    }

    function drawPath(ctx, layout, path, color, dashed) {
        ctx.beginPath();
        path.forEach(function (cell, index) {
            var x = layout.offsetX + cell[1] * layout.cell + layout.cell / 2;
            var y = layout.offsetY + cell[0] * layout.cell + layout.cell / 2;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.setLineDash(dashed ? [8, 6] : []);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawGoal(ctx, layout, row, col, color) {
        var x = layout.offsetX + col * layout.cell + layout.cell / 2;
        var y = layout.offsetY + row * layout.cell + layout.cell / 2;

        ctx.beginPath();
        ctx.arc(x, y, layout.cell * 0.18, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawAgent(ctx, layout, row, col, color, label) {
        var x = layout.offsetX + col * layout.cell + layout.cell / 2;
        var y = layout.offsetY + row * layout.cell + layout.cell / 2;
        var radius = layout.cell * 0.32;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.fillStyle = color === COLORS.agentB ? "#0a1320" : "#ffffff";
        ctx.font = "bold " + Math.max(12, radius) + "px Open Sans, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y + 1);
    }

    function drawConflict(ctx, layout, row, col) {
        var pad = 4;
        var x = layout.offsetX + col * layout.cell + pad;
        var y = layout.offsetY + row * layout.cell + pad;
        var size = layout.cell - pad * 2;

        ctx.fillStyle = "rgba(255, 122, 89, 0.25)";
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = COLORS.alert;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);

        ctx.fillStyle = COLORS.alert;
        ctx.font = "bold " + Math.max(13, layout.cell * 0.4) + "px Open Sans, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("!", x + size / 2, y + size / 2);
    }

    function markCell(ctx, layout, row, col, color, label) {
        var x = layout.offsetX + col * layout.cell;
        var y = layout.offsetY + row * layout.cell;

        ctx.fillStyle = color === COLORS.bay ? "rgba(86, 211, 100, 0.18)" : COLORS.accentSoft;
        ctx.fillRect(x, y, layout.cell, layout.cell);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, layout.cell - 4, layout.cell - 4);

        if (label) {
            ctx.fillStyle = color;
            ctx.font = "11px Open Sans, Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(label, x + layout.cell / 2, y + layout.cell - 5);
        }
    }

    function drawStatus(ctx, layout, text) {
        var words = text.split(" ");
        var line = "";
        var lines = [];
        var maxWidth = layout.width - 44;
        var lineHeight = 18;
        var barHeight = 58;

        ctx.fillStyle = COLORS.panel;
        ctx.fillRect(0, layout.height - barHeight, layout.width, barHeight);
        ctx.fillStyle = COLORS.text;
        ctx.font = "13px Open Sans, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        words.forEach(function (word) {
            var next = line ? line + " " + word : word;
            if (ctx.measureText(next).width > maxWidth) {
                lines.push(line);
                line = word;
            } else {
                line = next;
            }
        });

        if (line) {
            lines.push(line);
        }

        lines.forEach(function (entry, index) {
            var startY = layout.height - barHeight / 2 - ((lines.length - 1) * lineHeight) / 2;
            ctx.fillText(entry, layout.width / 2, startY + index * lineHeight);
        });
    }

    function renderDetails(target, key) {
        var strategy = STRATEGIES[key];

        if (!strategy) {
            return;
        }

        target.innerHTML =
            '<div class="project-chip-row">' +
            '<span class="project-tag">' + strategy.badge + '</span>' +
            '<span class="project-tag">' + strategy.cost + "</span>" +
            "</div>" +
            "<h3>" + strategy.label + "</h3>" +
            "<p>" + strategy.description + "</p>" +
            "<p><strong>Observed usage:</strong> " + strategy.usage + "</p>" +
            '<p class="project-note"><em>' + strategy.note + "</em></p>";
    }

    function init() {
        var canvas = document.getElementById("strategyCanvas");
        var detailTarget = document.getElementById("strategyDetails");
        var buttons = document.querySelectorAll(".strategy-tab");
        var current = "yield";
        var ctx;
        var animationId = null;
        var lastTime = null;
        var elapsed = 0;

        if (!canvas || !detailTarget || !buttons.length) {
            return;
        }

        ctx = canvas.getContext("2d");

        function resizeCanvas() {
            var rect = canvas.getBoundingClientRect();
            var dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.width * 0.76 * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw();
        }

        function clear(layout) {
            ctx.clearRect(0, 0, layout.width, layout.height);
            ctx.fillStyle = COLORS.background;
            ctx.fillRect(0, 0, layout.width, layout.height);
        }

        function drawScenario(progress, layout) {
            var pathA;
            var pathB;
            var originalB;
            var jointA;
            var jointB;
            var p;
            var subset;

            if (current === "yield") {
                pathA = [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 4], [2, 4], [2, 4]];
                pathB = [[2, 4], [2, 3], [1, 3], [1, 3], [1, 3], [2, 3], [2, 2], [2, 1], [2, 0]];
                originalB = [[2, 4], [2, 3], [2, 2], [2, 1], [2, 0]];
                drawGrid(ctx, layout);
                drawGoal(ctx, layout, 2, 4, COLORS.agentA);
                drawGoal(ctx, layout, 2, 0, COLORS.agentB);

                if (progress < 0.18) {
                    drawPath(ctx, layout, pathA, "rgba(142, 197, 255, 0.85)");
                    drawPath(ctx, layout, originalB, "rgba(255, 122, 89, 0.72)");
                    drawConflict(ctx, layout, 2, 2);
                    drawAgent(ctx, layout, 2, 0, COLORS.agentA, "A");
                    drawAgent(ctx, layout, 2, 4, COLORS.agentB, "B");
                    drawStatus(ctx, layout, "Conflict detected. The cheapest repair is a nearby parking detour.");
                    return;
                }

                p = (progress - 0.18) / 0.68;
                drawPath(ctx, layout, pathA, "rgba(142, 197, 255, 0.85)");
                drawPath(ctx, layout, pathB, "rgba(86, 211, 100, 0.9)", true);
                markCell(ctx, layout, 1, 3, COLORS.bay, "Park");
                drawAgent(ctx, layout, interpolate(pathA, p)[0], interpolate(pathA, p)[1], COLORS.agentA, "A");
                drawAgent(ctx, layout, interpolate(pathB, p)[0], interpolate(pathB, p)[1], COLORS.bay, "B");
                drawStatus(ctx, layout, "B yields, waits in a safe bay, and resumes after A passes.");
                return;
            }

            if (current === "static") {
                pathA = [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [4, 2]];
                originalB = [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]];
                pathB = [[2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [2, 4]];
                drawGrid(ctx, layout);
                drawGoal(ctx, layout, 4, 2, COLORS.agentA);
                drawGoal(ctx, layout, 2, 4, COLORS.agentB);

                if (progress < 0.2) {
                    drawPath(ctx, layout, pathA, "rgba(142, 197, 255, 0.85)");
                    drawPath(ctx, layout, originalB, "rgba(255, 122, 89, 0.72)");
                    drawConflict(ctx, layout, 2, 2);
                    drawAgent(ctx, layout, 0, 2, COLORS.agentA, "A");
                    drawAgent(ctx, layout, 2, 0, COLORS.agentB, "B");
                    drawStatus(ctx, layout, "Yield is insufficient. A bounded forbidden zone is broadcast instead.");
                    return;
                }

                p = Math.min(1, (progress - 0.2) / 0.6);
                drawPath(ctx, layout, pathA, "rgba(142, 197, 255, 0.85)");
                drawPath(ctx, layout, pathB, "rgba(10, 129, 247, 0.92)", true);
                markCell(ctx, layout, 2, 2, COLORS.alert, "Blocked");
                drawAgent(ctx, layout, interpolate(pathA, p)[0], interpolate(pathA, p)[1], COLORS.agentA, "A");
                drawAgent(ctx, layout, interpolate(pathB, p)[0], interpolate(pathB, p)[1], COLORS.accent, "B");
                drawStatus(ctx, layout, "Only the conflict cells are shared. B replans around them with local search.");
                return;
            }

            if (current === "dynamic") {
                pathA = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 4]];
                originalB = [[0, 4], [0, 3], [0, 2], [0, 1], [0, 0]];
                pathB = [[0, 4], [1, 4], [2, 4], [2, 3], [2, 2], [2, 1], [2, 0], [1, 0], [0, 0]];
                drawGrid(ctx, layout);
                drawGoal(ctx, layout, 0, 4, COLORS.agentA);
                drawGoal(ctx, layout, 0, 0, COLORS.agentB);

                if (progress < 0.18) {
                    drawPath(ctx, layout, pathA, "rgba(142, 197, 255, 0.85)");
                    drawPath(ctx, layout, originalB, "rgba(255, 122, 89, 0.72)");
                    drawConflict(ctx, layout, 0, 2);
                    drawConflict(ctx, layout, 0, 3);
                    drawAgent(ctx, layout, 0, 0, COLORS.agentA, "A");
                    drawAgent(ctx, layout, 0, 4, COLORS.agentB, "B");
                    drawStatus(ctx, layout, "Tight timing matters here, so a short future trajectory fragment is shared.");
                    return;
                }

                p = Math.min(1, (progress - 0.18) / 0.62);
                drawPath(ctx, layout, pathA, "rgba(255, 180, 84, 0.85)");
                drawPath(ctx, layout, pathB, "rgba(10, 129, 247, 0.92)", true);
                drawAgent(ctx, layout, interpolate(pathA, p)[0], interpolate(pathA, p)[1], COLORS.warning, "A");
                drawAgent(ctx, layout, interpolate(pathB, p)[0], interpolate(pathB, p)[1], COLORS.accent, "B");
                drawStatus(ctx, layout, "Dynamic replanning reasons over when cells will be occupied, not just where.");
                return;
            }

            subset = [];
            for (var row = 0; row < 5; row += 1) {
                for (var col = 0; col < 5; col += 1) {
                    if (!(row === 2 || col === 2 && row === 1)) {
                        subset.push([row, col]);
                    }
                }
            }
            jointA = [[2, 0], [2, 1], [2, 1], [2, 2], [2, 3], [2, 4]];
            jointB = [[2, 4], [2, 3], [2, 2], [1, 2], [1, 2], [2, 2], [2, 1], [2, 0]];
            drawGrid(ctx, layout, subset);
            drawGoal(ctx, layout, 2, 4, COLORS.agentA);
            drawGoal(ctx, layout, 2, 0, COLORS.agentB);

            if (progress < 0.2) {
                drawPath(ctx, layout, [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], "rgba(142, 197, 255, 0.85)");
                drawPath(ctx, layout, [[2, 4], [2, 3], [2, 2], [2, 1], [2, 0]], "rgba(255, 255, 255, 0.82)");
                drawConflict(ctx, layout, 2, 2);
                drawAgent(ctx, layout, 2, 0, COLORS.agentA, "A");
                drawAgent(ctx, layout, 2, 4, COLORS.agentB, "B");
                drawStatus(ctx, layout, "All cheap repairs fail in this choke point, so the agents are jointly replanned.");
                return;
            }

            p = Math.min(1, (progress - 0.2) / 0.62);
            drawPath(ctx, layout, jointA, "rgba(142, 197, 255, 0.92)", true);
            drawPath(ctx, layout, jointB, "rgba(255, 255, 255, 0.9)", true);
            markCell(ctx, layout, 1, 2, COLORS.bay, "Bay");
            drawAgent(ctx, layout, interpolate(jointA, p)[0], interpolate(jointA, p)[1], COLORS.agentA, "A");
            drawAgent(ctx, layout, interpolate(jointB, p)[0], interpolate(jointB, p)[1], COLORS.agentB, "B");
            drawStatus(ctx, layout, "Joint planning coordinates the bay exit, passage, and re-entry inside a bounded local window.");
        }

        function draw() {
            var width = canvas.width / (window.devicePixelRatio || 1);
            var height = canvas.height / (window.devicePixelRatio || 1);
            var layout = getLayout(width, height, 5, 48);
            var duration = 6400;
            var progress;

            clear(layout);

            if (current === "static") {
                duration = 6600;
            } else if (current === "dynamic") {
                duration = 6800;
            } else if (current === "joint") {
                duration = 7200;
            }

            progress = (elapsed % duration) / duration;
            drawScenario(progress, layout);
        }

        function tick(timestamp) {
            if (lastTime === null) {
                lastTime = timestamp;
            }

            elapsed += timestamp - lastTime;
            lastTime = timestamp;
            draw();
            animationId = window.requestAnimationFrame(tick);
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                current = button.getAttribute("data-strategy");
                elapsed = 0;
                lastTime = null;
                buttons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                renderDetails(detailTarget, current);
                draw();
            });
        });

        resizeCanvas();
        renderDetails(detailTarget, current);
        window.addEventListener("resize", resizeCanvas);
        animationId = window.requestAnimationFrame(tick);

        window.addEventListener("pagehide", function () {
            if (animationId) {
                window.cancelAnimationFrame(animationId);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", init);
})();
