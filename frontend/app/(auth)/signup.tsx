import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SignupScreen() {
  const [role, setRole] = useState<UserRole>('student');
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

  const handleSignup = async () => {
    if (!name || !department || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (role === 'student' && (!roll || !session)) {
      setErrorMsg('Roll number & Session are required for students.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const success = await signUp(
      { name, department, email, role, rollNumber: role === 'student' ? roll : undefined, session: role === 'student' ? session : undefined }, 
      password
    );

    if (success) {
      alert('Account created successfully! Please log in.');
      router.replace('/(auth)/login');
    } else {
      setErrorMsg('An account with this email already exists.');
    }
  };

  const emailLabel = role === 'student' ? 'Student Email' : role === 'teacher' ? 'Teacher Email' : 'Librarian Email';

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={20} color={colors.text} />
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join the Campus Library</Text>
        </View>

        {errorMsg ? <Text style={[styles.errorText, { color: colors.error }]}>{errorMsg}</Text> : null}

        <View style={styles.roleContainer}>
          {(['student', 'teacher', 'librarian'] as UserRole[]).map((r) => (
            <Pressable 
              key={r}
              style={[styles.roleBtn, { 
                borderColor: role === r ? colors.primary : colors.border,
                backgroundColor: role === r ? colors.primary + '15' : colors.surface
              }]}
              onPress={() => { setRole(r); setErrorMsg(''); }}
            >
              <Text style={[styles.roleText, { color: role === r ? colors.primary : colors.textSecondary }]}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          placeholder="Full Name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          placeholder="Department"
          placeholderTextColor={colors.textSecondary}
          value={department}
          onChangeText={setDepartment}
        />

        {role === 'student' && (
          <>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              placeholder="Roll Number"
              placeholderTextColor={colors.textSecondary}
              value={roll}
              onChangeText={setRoll}
            />
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              placeholder="Session (e.g. 2022-23)"
              placeholderTextColor={colors.textSecondary}
              value={session}
              onChangeText={setSession}
            />
          </>
        )}

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          placeholder={emailLabel}
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          placeholder="Confirm Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable 
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
          ]} 
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    padding: 8,
    marginLeft: -8,
  },
  header: { marginBottom: 24 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: { fontSize: 16 },
  errorText: {
    marginBottom: 16,
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  roleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#4F46E5',
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
