export default function parse(input) {
  let pcvs = [];
  //Vectorial notation, distribution -> real numbers
  const openVect = '(';
  const closeVect = ')';
  //Set notation, integers
  const openSet = '{';
  const closeSet = '}';
  //Number divider
  const divider = ',';

  let isGroup = false;
  let isSet = false;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === openSet || input[i] === openVect) {
      isGroup = true;
      if (input[i] === openSet) isSet = true;
    }

    if (isGroup) {
      let stringGroup = [];
      //Slice the current group
      for (
        let j = i + 1;
        input[j] !== closeSet && input[j] !== closeVect;
        j++
      ) {
        //Check if there is an invalid char in the group
        if (
          input[j] !== ',' &&
          input[j] !== '.' &&
          input[j] !== ' ' &&
          isNaN(parseFloat(input[j]))
        )
          throw new Error('Found NaN');
        if (input[j] !== ' ') stringGroup.push(input[j]);
      }

      stringGroup = stringGroup.join('');

      //Check if the empty string
      if (stringGroup === '') throw new Error('Empty input');

      let numeralInput = [];
      let count = 0;
      for (let j = 0; j < stringGroup.length; j++) {
        if (stringGroup[j] === divider) {
          let num = stringGroup.slice(j - count, j);
          //if num.length === 0 => two consecutive comas, invalid input
          if (num.length === 0) throw new Error('Two consecutive comas');

          numeralInput.push(+num);
          count = -1;
        }
        count++;
      }
      //Last element not cover by the for cycle
      let lastNum = stringGroup.slice(
        stringGroup.length - count,
        stringGroup.length
      );
      //Check if there is a last number
      if (lastNum.length === 0) {
        throw new Error('Missing last number');
      }
      numeralInput.push(+lastNum);

      if (isSet) {
        let bin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < numeralInput.length; i++) {
          //Set notation: check if num is valid range [0,11]
          if (numeralInput[i] < 0 || numeralInput[i] >= 12) {
            throw new Error('Set notation: out of range');
          }

          bin[numeralInput[i]] += 1;
        }
        pcvs.push(bin);
      } else {
        //If is in vectorial form, check if there are 12 elements
        if (numeralInput.length !== 12) {
          throw new Error('Vectorial notation: missing elements');
        }
        pcvs.push(numeralInput);
      }

      isGroup = false;
      isSet = false;
      i += count;
    }
  }

  if (pcvs.length === 0) throw new Error('Invalid input');

  return pcvs;
}
