// @flow
import Expo from 'expo-asset';
import isReactImageFormat from './isReactImageFormat';
import fromUriAsync from './fromUriAsync';

type ImageFormat = {
  uri: string,
  width?: number,
  height?: number,
};

export type WildCard = Expo.Asset | number | string | ImageFormat;

export type Options = {
  fileName: string,
};

const resolveAsync = async (fileReference: WildCard, options: Options = {}): Promise<?Asset> => {
  if (fileReference instanceof Expo.Asset) {
    /// Asset
    if (!fileReference.localUri) {
      await fileReference.downloadAsync();
    }
    return fileReference;
  } else if (typeof fileReference === 'string') {
    /// uri
    const asset = await fromUriAsync(fileReference, options.fileName);
    if (asset) {
      return await resolveAsync(asset);
    }
  } else if (typeof fileReference === 'number') {
    /// static resource
    const asset = await Expo.Asset.fromModule(fileReference);
    const output = await resolveAsync(asset);
    return output;
  } else if (isReactImageFormat(fileReference)) {
    /// { uri: string }
    const asset = await fromUriAsync(fileReference.uri, options.fileName);
    if (asset) {
      return await resolveAsync(asset);
    }
  }
};

export default resolveAsync;
