import { keyword, hex } from 'color-convert';
import { cloneDeep } from 'lodash';
import ValidationResult from './ValidationResult';

export default function cssValidate(customCss) {
  const css = cloneDeep(customCss);
  const validate = new ValidationResult();
  const testDiv = document.createElement('div');
  document.body.appendChild(testDiv);
  if (css.display) {
    testDiv.style.display = css.display;
    if (window.getComputedStyle(testDiv).display != css.display) {
      validate.setError(`Value for property 'display' could not be set or is incorrect`);
    }
  }
  testDiv.style.display = 'none';
  delete css.display;
  let cssProperties = Object.keys(css);
  cssProperties.forEach(function (property) {
    testDiv.style[property] = css[property];
  });
  const computedProperties = window.getComputedStyle(testDiv);
  cssProperties.forEach(function (property, index) {
    if (css[property] === "inherit" || css[property] === "initial") {
    } else if (property === '' || css[property] === '') {
      validate.setError(`Invalid CSS '${property}:${css[property]}'`);
    } else if (!(property in computedProperties)) {      
      validate.setError(`Invalid property '${property}'`);
    } else if (property.indexOf("color") !== -1 && !validColor(testDiv, css[property])) {
      validate.setError(`Invalid property value for '${property}'`);
    } else {
      const computedProp = getReleventProperties(computedProperties, property);
      if (!checkContainsVal(computedProp, css[property])) {
        validate.setError(`Value for property '${property}' could not be set or is incorrect`);
      }
    } 
  });
  document.body.removeChild(testDiv);
  return validate.result();
}

// Taken from https://stackoverflow.com/a/16994164
function validColor(div, colorString) {
  if (colorString === "transparent") return true;
  div.style.color = "rgb(0, 0, 0)";
  div.style.color = colorString;
  if (div.style.color !== "rgb(0, 0, 0)") return true;
  div.style.color = "rgb(255, 255, 255)";
  div.style.color = colorString;
  return div.style.color !== "rgb(255, 255, 255)";
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
