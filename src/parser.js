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
        stringGroup.push(input[j]);
      }

      stringGroup = stringGroup.join('');
      //console.log(stringGroup);

      //Check if the empty string
      if (stringGroup === '') throw new Error('empty input');

      let numeralInput = [];
      let count = 0;
      for (let j = 0; j < stringGroup.length; j++) {
        if (stringGroup[j] === divider) {
          let num = stringGroup.slice(j - count, j);
          //if num.length === 0 => two consecutive comas, invalid input
          if (num.length === 0) throw new Error('two consecutive comas');

          //check if num is valid range
          if (num < 0 || num >= 12)
            throw new Error('set notation: out of range');

          numeralInput.push(+num);
          count = -1;
        }
        count++;
      }
      //Last element not cover by the for cycle
      let num = stringGroup.slice(
        stringGroup.length - count,
        stringGroup.length
      );
      numeralInput.push(+num);
      //console.log(numeralInput);

      if (isSet) {
        let bin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < numeralInput.length; i++) {
          bin[numeralInput[i]] += 1;
        }
        pcvs.push(bin);
      } else {
        pcvs.push(numeralInput);
      }

      isGroup = false;
      isSet = false;
      i += count;
    }
  }

  //console.log(pcvs);
  if (pcvs.length === 0) throw new Error('invalid input');

  return pcvs;
}
