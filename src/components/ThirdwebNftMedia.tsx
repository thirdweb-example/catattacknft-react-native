import {NFTMetadata} from '@thirdweb-dev/sdk';
import {Image, ImageProps} from 'react-native';
import React from 'react';
export type ThirdwebNftMediaProps = {
  metadata: NFTMetadata;
} & Pick<ImageProps, 'style'>;

export const ThirdwebNftMedia = ({metadata, style}: ThirdwebNftMediaProps) => {
  return <Image style={style} source={{uri: metadata.image || ''}} />;
};
