import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import AppLogo from '@/components/AppLogo';

export default function SignupScreen() {
  const [role, setRole] = useState<UserRole>('reader');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [roll, setRoll] = useState('');
  const [session, setSession] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { signUp } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const canSubmit =
    name.trim().length > 0 &&
    department.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    (role === 'librarian' || (roll.trim().length > 0 && session.trim().length > 0));

  const handleSignup = async () => {
    if (!name || !department || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (role === 'reader' && (!roll || !session)) {
      setErrorMsg('Roll number & Session are required for readers.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const success = await signUp(
      { name, department, email, role, rollNumber: role === 'reader' ? roll : undefined, session: role === 'reader' ? session : undefined }, 
      password
    );

    if (success) {
      alert('Account created successfully! Please log in.');
      router.replace('/(auth)/login');
    } else {
      setErrorMsg('An account with this email already exists.');
    }
  };

  const emailLabel = role === 'reader' ? 'Reader Email' : 'Librarian Email';

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[colors.primary + '24', colors.background, colors.primaryLight + '30']}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <FontAwesome name="arrow-left" size={16} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.header}>
          <AppLogo size="md" />
          <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Start your library journey in seconds.</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {errorMsg ? <Text style={[styles.errorText, { color: colors.error }]}>{errorMsg}</Text> : null}

          <View style={styles.roleContainer}>
            {(['reader', 'librarian'] as UserRole[]).map((r) => (
              <Pressable 
                key={r}
                style={[styles.roleBtn, { 
                  borderColor: role === r ? colors.primary : colors.border,
                  backgroundColor: role === r ? colors.primary + '14' : colors.background
                }]}
                onPress={() => { setRole(r); setErrorMsg(''); }}
              >
                <Text style={[styles.roleText, { color: role === r ? colors.primary : colors.textSecondary }]}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <FontAwesome name="user-o" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Full name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <FontAwesome name="building-o" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Department"
              placeholderTextColor={colors.textSecondary}
              value={department}
              onChangeText={setDepartment}
            />
          </View>

          {role === 'reader' && (
            <>
              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <FontAwesome name="id-card-o" size={16} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Roll number"
                  placeholderTextColor={colors.textSecondary}
                  value={roll}
                  onChangeText={setRoll}
                />
              </View>
              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <FontAwesome name="calendar" size={16} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Session (e.g. 2022-23)"
                  placeholderTextColor={colors.textSecondary}
                  value={session}
                  onChangeText={setSession}
                />
              </View>
            </>
          )}

          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <FontAwesome name="envelope-o" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={emailLabel}
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
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

          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <FontAwesome name="check-circle-o" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirm password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.92 : canSubmit ? 1 : 0.55,
                shadowColor: colors.primary,
              }
            ]} 
            onPress={handleSignup}
            disabled={!canSubmit}
          >
            <Text style={styles.buttonText}>Create account</Text>
            <FontAwesome name="arrow-right" size={14} color="#FFF" />
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 22,
    paddingTop: 52,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { marginBottom: 16 },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, lineHeight: 22 },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#1A2B54',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  errorText: {
    marginBottom: 12,
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  roleBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputWrap: {
    height: 56,
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
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  }
});
