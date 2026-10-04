const pattern = '@.';
const pattern2 = /hello/;

let sentence = '6677supportAAA@facebook.com';
const regex = new RegExp(pattern);


let result = pattern2.test(sentence);
let result2 = regex.test('john#gmail.com');


console.log(result)
console.log(result2)



// test if a number is in a string
const numberpattern = /\d+/g;
const strr = 'I have 455655 oranges 78 mangoes';
let ans1 = strr.match(numberpattern);
console.log(ans1);

const pattern3 = '\\d+'
const regex2 = new RegExp(pattern3, 'g');
const ans2 = regex2.test(strr)
console.log(ans2);


//strict matching
const contactstring = 'reachmeat 779-908-754';
const phoneregex = /\d{3}-\d{3}-\d{3}/
const result4 = contactstring.match(phoneregex);
console.log(result4)

const newline = '\n'

///   \d is for digit, \w alphanum, \s whitespace, . any character except new line 


const three = /c.{2}t/i
// const three = /c.+t/


const result5 = three.test('COOT')
console.log(result5)

const emailregex = /^[a-zA-Z0-9-.]+@\w+.[a-z]+$/

const result7 = emailregex.test(sentence)
console.log(result7)