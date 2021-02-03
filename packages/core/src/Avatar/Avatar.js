import React from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core/';

const colors = [
  '#C4C4C4',
  '#00909E',
  '#01AAC1',
  '#0C99C1',
  '#395EA6',
  '#4B81AB',
  '#60C1C8',
  '#66C6BA',
  '#69C181',
  '#75A9F9',
  '#7B9C89',
  '#7BCECC',
  '#83AFA6',
  '#86B3E2',
  '#89C8FA',
  '#B36484',
  '#B39185',
  '#BE92CD',
  '#C080A3',
  '#C7A9CD',
  '#E16363',
  '#E8C074',
  '#F14A3B',
  '#F64E8B',
  '#F8C957',
  '#FF917B',
  '#FFA5A5',
  '#FFB44B',
  '#FFB6B9',
];

// return text color according to background
function getTextColor(bc) {
  let color = bc.charAt(0) === '#' ? bc.substring(1, 7) : bc;
  if (color.length === 3) {
    color = color
      .split('')
      .map(function (hex) {
        return hex + hex;
      })
      .join('');
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000' : '#fff';
}

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash += charCode;
  }
  return hash;
}

// color genrator by string value
function stringToColor(string) {
  const hash = hashStr(string);
  const index = hash % colors.length;
  return colors[index];
}

function getInitials(name) {
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
}

const Avatar = React.forwardRef((props, ref) => {
  const { name, style, textVariant, ...rest } = props;
  const alt = name || props.alt || '';
  const bgColor = stringToColor(alt);
  const textColor = getTextColor(bgColor);
  const initials = getInitials(alt);

  return (
    <MuiAvatar
      {...rest}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        ...style,
      }}
      ref={ref}
    >
      {initials ? <p>{initials}</p> : ''}
    </MuiAvatar>
  );
});

export default Avatar;
