import * as React from 'react';
// props from mui
import { AvatarProps } from '@material-ui/core';

// custom props
interface CustomAvatarProps {
  name: string;
}

type MainProps = AvatarProps | CustomAvatarProps;
declare class CustomAvatar extends React.Component<MainProps> {}
declare const CustomAvatarType: typeof CustomAvatar;

export = CustomAvatarType;
