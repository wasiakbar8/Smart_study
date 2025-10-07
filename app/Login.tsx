import { useRouter } from "expo-router";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../FirebaseConfig";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ User signed in:", userCredential.user.uid);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        console.log("⚠️ Email not verified");
        
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in. Check your inbox for the verification link.",
          [
            {
              text: "Resend Email",
              onPress: async () => {
                try {
                  await sendEmailVerification(userCredential.user);
                  console.log("✅ Verification email resent");
                  Alert.alert("Success", "Verification email sent! Please check your inbox.");
                } catch (error) {
                  console.log("❌ Resend verification error:", error);
                  Alert.alert("Error", "Failed to send verification email. Please try again.");
                }
              },
            },
            {
              text: "OK",
              style: "cancel",
            },
          ]
        );
        
        // Sign out the user since they're not verified
        await auth.signOut();
        setLoading(false);
        return;
      }

      console.log("✅ Email verified, redirecting to dashboard");
      clearInputs();
      setLoading(false);
      router.replace("./dashboard");
      
    } catch (error: any) {
      console.log("❌ Login error:", error);
      setLoading(false);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      Alert.alert("Login Failed", errorMessage);
    }
  };

  const goToSignup = () => {
    router.push("./signup");
  };

  const goToForgotPassword = () => {
    router.push("./resetpassword");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ddd"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ddd"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity onPress={goToForgotPassword} disabled={loading}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#005c45" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={goToSignup} disabled={loading}>
        <Text style={styles.registerText}>
          Don't have an account?{" "}
          <Text style={styles.registerLink}>Create one</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#005c45",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#cde0d8",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  forgotPassword: {
    color: "#00e0a4",
    textAlign: "right",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#005c45",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 25,
    fontSize: 14,
  },
  registerLink: {
    color: "#00e0a4",
    fontWeight: "bold",
  },
});