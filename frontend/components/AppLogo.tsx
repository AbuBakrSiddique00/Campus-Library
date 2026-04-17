import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type AppLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
};

const SIZE_MAP = {
  sm: 42,
  md: 56,
  lg: 72,
};

export default function AppLogo({ size = 'md', showText = true }: AppLogoProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const iconSize = SIZE_MAP[size];

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.logoCircle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}
      >
        <FontAwesome name="book" size={Math.round(iconSize * 0.42)} color="#FFFFFF" />
      </LinearGradient>
      {showText ? (
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Campus Library</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Learn. Borrow. Grow.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D5BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});
