import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AppLogo from '@/components/AppLogo';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { signIn } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setErrorMsg('');

    const success = await signIn(email, password);
    if (success) {
      router.replace('/');
    } else {
      setErrorMsg('Invalid email or password. Do you have an account?');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[colors.primary + '24', colors.background, colors.primaryLight + '35']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <AppLogo size="md" />
          <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to your account and continue exploring.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {errorMsg ? <Text style={[styles.errorText, { color: colors.error }]}>{errorMsg}</Text> : null}

          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <FontAwesome name="envelope-o" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email address"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <FontAwesome name="lock" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.92 : canSubmit ? 1 : 0.55,
                shadowColor: colors.primary,
              },
            ]}
            onPress={handleLogin}
            disabled={!canSubmit}
          >
            <Text style={styles.buttonText}>Sign in</Text>
            <FontAwesome name="arrow-right" size={14} color="#FFF" />
          </Pressable>

          <View style={styles.footer}>
            <Text style={{ color: colors.textSecondary }}>New here?</Text>
            <Pressable onPress={() => router.push('/(auth)/signup')}>
              <Text style={[styles.linkText, { color: colors.primary }]}> Create account</Text>
            </Pressable>
          </View>

          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Test: admin@library.com
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  hero: {
    marginBottom: 18,
  },
  card: {
    padding: 22,
    borderRadius: 26,
    borderWidth: 1,
    backdropFilter: 'blur(6px)',
    shadowColor: '#1A2B54',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 9,
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    marginBottom: 12,
    fontWeight: '600',
  },
  inputWrap: {
    height: 54,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    flexDirection: 'row',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  linkText: {
    fontWeight: '700',
  },
  hint: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 12,
  },
});
