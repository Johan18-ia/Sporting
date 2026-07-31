import React from 'react';
import { Text } from 'react-native';

export function AlertMessage({ message }: { message: string }) {
  return <Text>{message}</Text>;
}
