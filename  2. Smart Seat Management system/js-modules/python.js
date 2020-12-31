const { spawn } = require("node-pty");
const db = require('./database');

module.exports = (io) => {
    var zones = ['A', 'B', 'C', 'D'];
    var pyProcesses = [];

    zones.forEach((element, index) => {
        pyProcesses.push(spawn("python3", ["seat_detection.py", "--video", `input/zone${index + 1}.mp4`, "--seat-bb-csv", `data/seat_bb_vid${index + 1}.csv`, "--output", `output/output${index + 1}.avi`, "--zone", element], {
            cwd: "cv-seat-detection"
        }));

        pyProcesses[index].on("data", data => {
            console.log(`Zone ${element} -> ${data.trim()}`);
            data = data.split(': ');
            let seat_id = data[0].trim(),
                status = data[1].trim();

            if (status == 'RESERVED') {
                db.updateInfo(Number(seat_id), element, status.toLowerCase(), Date.now(), Date.now() + (30 * 60 * 1000));

                setTimeout(() => {
                    db.getReserved()
                        .then(data => {
                            io.emit("AVAILABLE");
                            for (let i = 0; i < data.length; i++) {
                                if (data[i][seat_id] == seat_id && data[i][zone_id] == element && data[i][reservation_end_time] <= Date.now()) {
                                    db.updateInfo(Number(seat_id), element, 'available');
                                    break
                                }
                            }
                        })
                }, 30 * 60 * 1000);
            } else {
                db.updateInfo(Number(seat_id), element, status.toLowerCase());
            }
            io.emit(status);
        })

        pyProcesses[index].on("exit", exitCode => {
            console.log(`pyProcess #${index + 1} Exiting with code ` + exitCode);
        });
    })
}