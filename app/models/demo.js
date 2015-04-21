// 1
// find each person with a last name matching 'Ghost'
var query = Person.findOne({ 'name.last': 'Ghost' });

// selecting the `name` and `occupation` fields
query.select('name occupation');

// execute the query at a later time
query.exec(function (err, person) {
  if (err) return handleError(err);
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
})



// 2
Person
.find({ occupation: /host/ })
.where('name.last').equals('Ghost')
.where('age').gt(17).lt(66)
.where('likes').in(['vaporizing', 'talking'])
.limit(10)
.sort('-occupation')
.select('name occupation')
.exec(callback);

// 3
// population ref to other documents
// 4
Tank.findByIdAndUpdate(id, { $set: { size: 'large' }}, function (err, tank) {
  if (err) return handleError(err);
  res.send(tank);
});
// 5
Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);

/**
 * mongodb
 */

db.students.update(
   { _id: 1 },
   {
     $push: {
        scores: {
           $each: [ { attempt: 3, score: 7 }, { attempt: 4, score: 4 } ],
           $sort: { score: 1 },
           $slice: -3
        }
     }
   }
)