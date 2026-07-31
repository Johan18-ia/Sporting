import React from 'react';
import { View, Text } from 'react-native';

export function ActivityItem({ label }: { label: string }) {
  return (
    <View>
      <Text>{label}</Text>
    </View>
  );
}
