import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../FirebaseConfig";

const Register: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const clearInputs = () => {
    setEmail("");
    setRegistrationNo("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleRegister = async () => {
    if (!email || !registrationNo || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Update profile
      await updateProfile(user, { displayName: registrationNo });

      // Step 3: Save data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        registrationNo,
        createdAt: new Date().toISOString(),
        uid: user.uid,
        emailVerified: false,
      });

      // Step 4: Send verification email BEFORE signing out
      try {
        await sendEmailVerification(user, {
          // Optional: Add action code settings for better UX
          url: 'https://your-app.com/login', // Replace with your app's deep link
          handleCodeInApp: false,
        });
        console.log("✅ Verification email sent successfully during signup");
      } catch (emailError: any) {
        console.log("⚠️ Email sending error:", emailError);
        // Continue even if email fails - user can resend later
      }

      // Step 5: Store email for modal and show success
      setVerificationEmail(email);
      setShowModal(true);

      // Step 6: Small delay to ensure modal is visible before sign out
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 7: Sign out the user since email isn't verified yet
      await signOut(auth);
      console.log("✅ User signed out after registration");

      // Step 8: Reset form
      clearInputs();
      setLoading(false);
    } catch (error: any) {
      console.log("❌ Registration Error:", error);
      setLoading(false);

      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please login instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      Alert.alert("Registration Failed", errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account 🎓</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

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
          placeholder="Registration Number"
          placeholderTextColor="#ddd"
          value={registrationNo}
          onChangeText={setRegistrationNo}
          autoCapitalize="characters"
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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ddd"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#005c45" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("./Login")} disabled={loading}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Login here</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Enhanced Success Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowModal(false);
          router.replace("./Login");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Success Icon */}
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            
            <Text style={styles.modalTitle}>Account Created! 🎉</Text>
            <Text style={styles.modalSubtitle}>Verification Email Sent</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.modalMessage}>
              We've sent a verification email to:
            </Text>
            <Text style={styles.emailText}>{verificationEmail}</Text>
            
            <View style={styles.instructionsBox}>
              <Text style={styles.instructionsTitle}>📋 Next Steps:</Text>
              <Text style={styles.instructionItem}>1. Check your email inbox</Text>
              <Text style={styles.instructionItem}>2. Click the verification link</Text>
              <Text style={styles.instructionItem}>3. Return here to login</Text>
            </View>
            
            <Text style={styles.noteText}>
              💡 Don't see the email? Check your spam folder
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                setVerificationEmail("");
                router.replace("./Login");
              }}
            >
              <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: "#005c45",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
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
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: "#005c45",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 25,
    fontSize: 14,
  },
  loginLink: {
    color: "#00e0a4",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00e0a4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  successIconText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#005c45",
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  modalMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#005c45",
    marginBottom: 20,
    textAlign: "center",
  },
  instructionsBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    marginBottom: 15,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  instructionItem: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    paddingLeft: 5,
  },
  noteText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  modalButton: {
    backgroundColor: "#005c45",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});