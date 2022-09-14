import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';
import { body } from 'express-validator';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

function isNameValid(name) {
    const format = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
    return format.test(name)
}

function validateRequest(name, reps, weight, unit, date) {
    if(isNameValid(name) === true && reps > 0 && weight > 0 && (unit === "kgs" || unit === "lbs") && 
    isDateValid(date) === true) {
        return true;
    } else {
        return false;
    }
}

/**
 * Create an exercise with user, reps, weight, unit, and date
 */
app.post('/exercises', (req, res) => {
    if (!validateRequest(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)) {
        return res.status(400).json({ Error: 'Invalid Request'});
    } 
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date) 
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        }) 
        
});

/**
 * Retrieve exercises
 */
app.get('/exercises', (req, res) => {
    const filter = {}
    if(req.query === undefined){
        return filter
    }

    exercises.findExercises(req.query, '', 0)
    .then(exercise => {
        res.json(exercise);
    })
    .catch(error => {
        console.error(error);
        res.send({ Error: 'Request failed' });
    })
});


/**
 * Retrieve exercises by ID
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExercisesById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).send({ Error: "Not found" });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        })
})

/**
 * Update exercises
 */
app.put('/exercises/:_id', (req, res) => {
    if (!validateRequest(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)) {
        return res.status(400).json({ Error: 'Invalid Request'});
    }  
    exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({_id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date})
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error)
            res.send({ Error: 'Request failed' });
        })
})

/**
 * Delete exercises
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
    .then(deletedCount => {
        if (deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).json({ Error: 'Not found'});
        }
    })
    .catch(error => {
        console.error(error);
        res.send({ error: 'Request failed' });
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});