import { keyword, hex } from 'color-convert';

export default function cssValidate(css ) {
  const testDiv = document.createElement('div');
  document.body.appendChild(testDiv);
  let isValid = true;
  let error = [];
  if (css.display) {
    testDiv.style.display = css.display;
    if (window.getComputedStyle(testDiv).display != css.display) {
      error.push('Value for property \'display\' could not be set or is incorrect');
    }
  }
  testDiv.style.display = 'none';
  delete css.display;
  let cssProperties = Object.keys(css);
  let cssValues = Object.keys(css);
  cssProperties.forEach(function (property) {
    testDiv.style[property] = css[property];
  });
  const computedProperties = window.getComputedStyle(testDiv);
  cssProperties.forEach(function (property, index) {
    if (property === '' || css[property] === '') {
      error.push(`Invalid CSS \'${property}:${property ? css[property] : cssValues[index]}\'`);
      isValid = false;
    } else if (!(property in computedProperties)) {      
      error.push(`Invalid property \'${property}\'`);
      isValid = false;
    } else {
      let computedProp = getReleventProperties(computedProperties, property);
      if (!checkContainsVal(computedProp, css[property])) {
        error.push(`Value for property \'${property}\' could not be set or is incorrect`);
        isValid = false;
      }
    } 
  });
  document.body.removeChild(testDiv);
  return { valid: isValid, error: error };
}

function getReleventProperties(computedProperties, property) {
  return Array.prototype.filter.call(computedProperties, function (prop) {
    return prop.includes(property);
  }).reduce(function (acc, prop) {
    acc.push((computedProperties[prop] || "").replace(/\s+/g, ""));
    return acc;
  }, []);
}

function roundValueWithPx(str) {
  if (str.substr(str.length - 2) === 'px') {
    return String(Math.ceil(str.substr(0, str.length - 2))) + 'px';
  }
  return str;
}

function checkContainsVal(computedProperties, value) {
  let trimmedValue = value.replace(/\s+/g, " ").replace(/,\ /g, ",");
  trimmedValue = trimmedValue.split(" ");
  return trimmedValue.every(function (val) {
    return computedProperties.some(function (prop) {
      if (roundValueWithPx(prop).includes(val) || prop.includes(getRGBValue(val))) {
        return true;
      }
      return false;
    });
  })
}

function getRGBValue(val) {
  let finalVal = getRGBString(val, keyword.rgb(val));
  if (val.charAt(0) === '#') {
    finalVal = getRGBString(val, hex.rgb(val.substr(1)));
  }
  if (finalVal != val) return finalVal;
  return val;
}

function getRGBString(orig, val) {
  if (Array.isArray(val)) {
    val = `rgb(${val.join(',')})`;
  }
  return val;
}
