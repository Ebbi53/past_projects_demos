var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var init = function () {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            if (err) throw reject(err);
            var dbo = db.db("mydb");
            var myobj = [
                {
                    'seat_id': 1,
                    'zone_id': 'A',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                        'Turn left.'
                    ]
                },
                {
                    'seat_id': 2,
                    'zone_id': 'A',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                        'Turn left.'
                    ]
                },
                {
                    'seat_id': 1,
                    'zone_id': 'B',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'Turn left.',
                        'Keep moving forward until you see the group study area on your right.',
                        'After entering the Library from the main entrance, turn right.',
                    ]
                },
                {
                    'seat_id': 1,
                    'zone_id': 'C',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                    ]
                },
                {
                    'seat_id': 2,
                    'zone_id': 'C',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                    ]
                },
                {
                    'seat_id': 3,
                    'zone_id': 'C',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                    ]
                },
                {
                    'seat_id': 4,
                    'zone_id': 'C',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                    ]
                },
                {
                    'seat_id': 5,
                    'zone_id': 'C',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                    ]
                },
                {
                    'seat_id': 6,
                    'zone_id': 'C',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn right.',
                        'Keep moving forward until you see the group study area on your right.',
                    ]
                },
                {
                    'seat_id': 1,
                    'zone_id': 'D',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.'
                    ]
                },
                {
                    'seat_id': 2,
                    'zone_id': 'D',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.'
                    ]
                },
                {
                    'seat_id': 3,
                    'zone_id': 'D',
                    'status': 'available',
                    'reservation_start_time': 0,
                    'reservation_end_time': 0,
                    'directions': [
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                        'After entering the Library from the main entrance, turn right.',
                        'Turn left.',
                    ]
                },
            ];
            dbo.listCollections({ name: "seats" }).next(function (err, collinfo) {
                if (collinfo) {
                    // The collection exists
                    dbo.collection("seats").drop(function (err, delOK) {
                        if (err) throw err;
                        if (delOK) console.log("Collection deleted");
                        db.close();
                    });
                }
                dbo.collection("seats").insertMany(myobj, function (err, res) {
                    if (err) throw reject(err);
                    resolve("Number of documents inserted: " + res.insertedCount);
                    db.close();
                });
            });
        });
    })
}

var getOverview = function () {
    return new Promise((resolve, reject) => {

        var resp = {};
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err);
            var dbo = db.db("mydb");
            dbo.collection("seats").countDocuments({}, (err, numb) => {
                if (err) reject(err);
                resp['Total'] = numb;

                dbo.collection("seats").countDocuments({
                    status: "available"
                }, (err, numb) => {
                    if (err) reject(err);
                    resp['Available'] = numb;

                    dbo.collection("seats").countDocuments({
                        status: "reserved"
                    }, (err, numb) => {
                        if (err) reject(err);
                        resp['Reserved'] = numb;

                        dbo.collection("seats").countDocuments({
                            status: "occupied"
                        }, (err, numb) => {
                            if (err) reject(err);
                            resp['Occupied'] = numb;
                            resolve(resp);
                        })
                    })
                })
            });
        })
    })
}

var getZones = function () {
    return new Promise((resolve, reject) => {

        var resp = {};
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err);
            var dbo = db.db("mydb");

            dbo.collection("seats").distinct('zone_id', {}, (err, result) => {
                if (err) reject(err);
                (async () => {
                    for (let index = 0; index < result.length; index++) {
                        let el = result[index];
                        resp[el] = {};
                        await new Promise((resolve, reject) => {
                            dbo.collection("seats").countDocuments({
                                zone_id: el,
                                status: "occupied"
                            }, (err, numb) => {
                                if (err) reject(err);
                                resp[el]['Occupied'] = numb;

                                dbo.collection("seats").countDocuments({
                                    zone_id: el,
                                    status: "available"
                                }, (err, numb) => {
                                    if (err) reject(err);
                                    resp[el]['Available'] = numb

                                    dbo.collection("seats").countDocuments({
                                        zone_id: el,
                                        status: "reserved"
                                    }, (err, numb) => {
                                        if (err) reject(err);
                                        resp[el]['Reserved'] = numb;

                                        dbo.collection("seats").find({
                                            zone_id: el,
                                            status: "reserved"
                                        }, { projection: { _id: 0, seat_id: 1, reservation_end_time: 1 } }).toArray((err, result) => {
                                            if (err) reject(err);
                                            resp[el]['Reservation counters'] = result;

                                            dbo.collection("seats").find({
                                                zone_id: el,
                                            }, { projection: { _id: 0, directions: 1 } }).toArray((err, result) => {
                                                if (err) reject(err);
                                                resp[el]['Directions'] = result[0]['directions'];
                                                resolve()
                                            })
                                        })
                                    })
                                })
                            })
                        })
                        if (index == result.length - 1) {
                            resolve(resp);
                        }
                    }
                })();
            })
        })
    })
}

var getAvailable = function () {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err);
            var dbo = db.db("mydb");

            dbo.collection("seats").find({
                status: "available"
            }, { projection: { _id: 0, seat_id: 1, zone_id: 1, directions: 1 } }).toArray((err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    })
}

var getReserved = function () {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err);
            var dbo = db.db("mydb");

            dbo.collection("seats").find({
                status: "reserved"
            }, { projection: { _id: 0, seat_id: 1, zone_id: 1, directions: 1, reservation_end_time: 1 } }).toArray((err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    })
}

var updateInfo = function (seat_id, zone_id, status, reservation_start_time = 0, reservation_end_time = 0) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");

        var myquery = {
            seat_id,
            zone_id
        };

        var newvalues = {
            $set: {
                status,
                reservation_start_time,
                reservation_end_time
            }
        };
        dbo.collection("seats").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " document(s) updated");
            db.close();
        });
    });
}

module.exports = {
    init,
    getOverview,
    getZones,
    getAvailable,
    getReserved,
    updateInfo
}