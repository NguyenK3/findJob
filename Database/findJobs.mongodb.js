/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('findJob');

// db.companies.find().pretty()


// db.jobs.aggregate([
//     {
//         $lookup: {
//             from: "companies",
//             localField: "company._id",
//             foreignField: "_id",
//             as: "companies"
//         }
//     }
// ])

// db.jobs.find({ "company._id": { $exists: true } });
// db.companies.find({ "_id": { $exists: true } });

// db.jobs.find({ "company._id": { $exists: true } });
// db.companies.find({ "_id": { $type: "objectId" } });

// db.jobs.aggregate([
//     {
//         $lookup: {
//             from: "jobs",
//             let: { companyId: "$_id" }, // Lấy _id từ companies
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: { $eq: ["$company._id", { $toObjectId: "$$companyId" }] } // Khớp với company._id trong jobs
//                     }
//                 }
//             ],
//             as: "jobs" // Kết quả trả về dưới tên "jobs"
//         }
//     }
// ]);


// db.companies.aggregate([
//     {
//         $lookup: {
//             from: "jobs",  // Truy vấn từ collection "jobs"
//             let: { companyId: "$_id" },  // Lấy _id từ companies
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: {
//                             $eq: [
//                                 { $toObjectId: "$company._id" },  // Chuyển company._id từ string thành ObjectId
//                                 "$$companyId"  // Khớp với _id của companies
//                             ]
//                         }
//                     }
//                 }
//             ],
//             as: "jobs"  // Kết quả sẽ được trả về dưới tên "jobs"
//         }
//     }
// ]);

db.jobs.aggregate([
    {
        $lookup: {
            from: "companies",  // Truy vấn từ collection "companies"
            let: { companyId: "$company._id" },  // Lấy company._id từ jobs
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: [
                                "$_id",
                                { $toObjectId: "$$companyId" }  // Chuyển company._id từ string thành ObjectId và khớp với _id trong companies
                            ]
                        }
                    }
                }
            ],
            as: "companies"  // Kết quả sẽ được trả về dưới tên "companies"
        }
    }
]);

