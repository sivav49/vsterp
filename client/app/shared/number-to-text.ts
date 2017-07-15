export function amountInWords(n) {
  const a = numberArrayBySeparator(n);
  const andPos = andPosition(a);
  const placeWord = ['', 'Hundred', 'Thousand', 'Lakh', 'Crore'];

  let word = '', i;

  for (i = 0; i < a.length; i++) {
    if (a[i] !== 0) {
      word = ' ' + num2word(a[i]) + (placeWord[i] ? ' ' + placeWord[i] : '') + word;
    }
    if (i === andPos) {
      word = ' And' + word;
    }
  }
  return 'Rupees ' + word.substr(1) + ' Only';
}

function numberArrayBySeparator(n) {
  const arr = [];
  const numSept = [2, 1, 2, 2];

  let numSeptIndex = 0;

  while (n > 0) {
    const sept = Math.pow(10, numSept[numSeptIndex++ % 4]);
    arr.push(n % sept);
    n = Math.floor(n / sept);
  }
  return arr;
}

function andPosition(n) {
  let i, firstNumber = false;
  for (i = 0; i < n.length; i++) {
    if (n[i] > 0) {
      if (!firstNumber) {
        firstNumber = true;
      } else {
        break;
      }
    }
  }
  return i === n.length ? -1 : i - 1;
}

function num2word(n) {
  const ones = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (n < 20) {
    return ones[n - 1];
  } else {
    let word = '';
    word += tens[Math.floor(n / 10) - 2];
    word += n % 10 > 0 ? ' ' + ones[(n % 10) - 1] : '';
    return word;
  }
}
