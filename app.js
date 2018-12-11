var _ = require("underscore");
var fs = require("fs");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var qData = JSON.parse(fs.readFileSync('data-3.json'))
console.log('Question', qData.data.question.text);
//console.log(qData);
console.log("Answers:");
console.log("");
var answers = [];
var maxBlanks = qData.data.data.expAnsIndices[0].length;
rl.on('line', (line) => {
    answers.push(line);
    //console.log(`Received: ${line}`);
    if (answers.length == maxBlanks) {
        rl.close();
        // do evaluation here
        evaluate(answers);
    }
});

function evaluate(answers) {
    // preprocess user answers - remove embedded white spaces, and convert to lower case, based on the config
    answers = _.map(answers, function (a) {
        var ans = a;
        if (qData.config.eval_ignore_whitespaces)
            ans = ans.trim().replace(/\s/g, '');
        if (qData.config.eval_ignore_case)
            ans = ans.toLowerCase();
        return ans;
    });

    // get user answer indices. (this is the index in the expAnswers array in which a match is found, 
    // -1 if no match found)
    var userAnsIndices = _.map(answers, function (answer) {
        return _.findIndex(qData.data.data.expAnswers, function (expAns) {
            return _.contains(expAns, answer);
        });
    });
    
    // Sort the userAnsIndices array elements in case if unordered evaluation
    if (qData.config.eval_unordered)
        userAnsIndices = _.sortBy(userAnsIndices, function (u) { return u });
    console.log(userAnsIndices);

    // if the userAnsIndices are found in the expAnsIndices, then the question is sovled!
    var isSolved = _.some(qData.data.data.expAnsIndices, function (expAns) {
        return _.isEqual(expAns, userAnsIndices);
    });
    console.log('Solved', isSolved);
}
