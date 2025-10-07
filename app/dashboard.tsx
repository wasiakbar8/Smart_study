import React, { useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Type definitions
interface Summary {
  id: number;
  original: string;
  summary: string;
  date: string;
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  topic: string;
}

interface Quiz {
  id: number;
  title: string;
  questions: number;
  topic: string;
  date: string;
}

interface StudyPlan {
  id: number;
  subject: string;
  topic: string;
  time: string;
  completed: boolean;
}

interface Achievement {
  id: number;
  name: string;
  icon: string;
  unlocked: boolean;
}

export default function StudyAppDashboard() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userName] = useState<string>('Student');
  const [streak, setStreak] = useState<number>(7);
  const [totalPoints, setTotalPoints] = useState<number>(1250);
  const [studyMinutes, setStudyMinutes] = useState<number>(145);
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([
    { id: 1, subject: 'Mathematics', topic: 'Calculus', time: '10:00 AM', completed: false },
    { id: 2, subject: 'Physics', topic: 'Mechanics', time: '2:00 PM', completed: false },
  ]);
  const [achievements] = useState<Achievement[]>([
    { id: 1, name: '7 Day Streak', icon: '🔥', unlocked: true },
    { id: 2, name: 'Quiz Master', icon: '🎯', unlocked: true },
    { id: 3, name: '50 Flashcards', icon: '📚', unlocked: false },
    { id: 4, name: 'Early Bird', icon: '🌅', unlocked: true },
  ]);

  const primaryColor = '#005c45';
  const secondaryColor = '#008060';
  const lightGreen = '#e6f4f1';

  const generateSummary = () => {
    if (!noteText.trim()) {
      Alert.alert('Error', 'Please enter some text to summarize');
      return;
    }
    
    const newSummary: Summary = {
      id: Date.now(),
      original: noteText,
      summary: `Summary: ${noteText.substring(0, 100)}... [AI-generated summary would appear here]`,
      date: new Date().toLocaleDateString(),
    };
    
    setSummaries([newSummary, ...summaries]);
    setNoteText('');
    setUploadModalVisible(false);
    Alert.alert('Success', 'Summary generated successfully!');
  };

  const generateFlashcards = () => {
    if (!noteText.trim()) {
      Alert.alert('Error', 'Please enter some text to generate flashcards');
      return;
    }
    
    const newFlashcards: Flashcard[] = [
      { id: Date.now(), question: 'Sample Question 1', answer: 'Sample Answer 1', topic: 'General' },
      { id: Date.now() + 1, question: 'Sample Question 2', answer: 'Sample Answer 2', topic: 'General' },
    ];
    
    setFlashcards([...flashcards, ...newFlashcards]);
    setNoteText('');
    setUploadModalVisible(false);
    Alert.alert('Success', 'Flashcards generated successfully!');
  };

  const generateQuiz = () => {
    if (!noteText.trim()) {
      Alert.alert('Error', 'Please enter some text to generate quiz');
      return;
    }
    
    const newQuiz: Quiz = {
      id: Date.now(),
      title: 'AI Generated Quiz',
      questions: 10,
      topic: 'General',
      date: new Date().toLocaleDateString(),
    };
    
    setQuizzes([newQuiz, ...quizzes]);
    setNoteText('');
    setUploadModalVisible(false);
    Alert.alert('Success', 'Quiz generated successfully!');
  };

  const toggleStudyPlan = (id: number) => {
    const plan = studyPlans.find(p => p.id === id);
    if (!plan) return;
    
    setStudyPlans(studyPlans.map(p => 
      p.id === id ? { ...p, completed: !p.completed } : p
    ));
    
    if (!plan.completed) {
      setTotalPoints(totalPoints + 50);
    }
  };

  const renderHome = () => (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
          <Text style={styles.subGreeting}>Ready to learn something new?</Text>
        </View>
        <View style={styles.streakContainer}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: primaryColor }]}>
          <Text style={styles.statIcon}>🏆</Text>
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: secondaryColor }]}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{studyMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#00a896' }]}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statValue}>{summaries.length + flashcards.length}</Text>
          <Text style={styles.statLabel}>Resources</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => setUploadModalVisible(true)}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Upload Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => setActiveTab('flashcards')}
          >
            <Text style={styles.actionIcon}>📖</Text>
            <Text style={styles.actionText}>Flashcards</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => setActiveTab('quiz')}
          >
            <Text style={styles.actionIcon}>🧠</Text>
            <Text style={styles.actionText}>Take Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => setActiveTab('planner')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Study Plan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Study Plan</Text>
        {studyPlans.slice(0, 2).map(plan => (
          <TouchableOpacity 
            key={plan.id}
            style={styles.planCard}
            onPress={() => toggleStudyPlan(plan.id)}
          >
            <View style={styles.planContent}>
              <View style={[styles.checkbox, plan.completed && styles.checkboxCompleted]}>
                {plan.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planSubject, plan.completed && styles.completedText]}>
                  {plan.subject}
                </Text>
                <Text style={styles.planTopic}>{plan.topic}</Text>
              </View>
              <Text style={styles.planTime}>{plan.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.filter(a => a.unlocked).map(achievement => (
            <View key={achievement.id} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderSummaries = () => (
    <ScrollView style={styles.content}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>AI Summaries</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setUploadModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>
      {summaries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyText}>No summaries yet</Text>
          <Text style={styles.emptySubtext}>Upload notes to generate AI summaries</Text>
        </View>
      ) : (
        summaries.map(summary => (
          <View key={summary.id} style={styles.summaryCard}>
            <Text style={styles.summaryDate}>{summary.date}</Text>
            <Text style={styles.summaryText}>{summary.summary}</Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Full Summary</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderFlashcards = () => (
    <ScrollView style={styles.content}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Flashcards</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setUploadModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>
      {flashcards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>No flashcards yet</Text>
          <Text style={styles.emptySubtext}>Generate flashcards from your notes</Text>
        </View>
      ) : (
        <View style={styles.flashcardsGrid}>
          {flashcards.map(card => (
            <View key={card.id} style={styles.flashcard}>
              <Text style={styles.flashcardLabel}>Q:</Text>
              <Text style={styles.flashcardQuestion}>{card.question}</Text>
              <View style={styles.flashcardDivider} />
              <Text style={styles.flashcardLabel}>A:</Text>
              <Text style={styles.flashcardAnswer}>{card.answer}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderQuiz = () => (
    <ScrollView style={styles.content}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Quizzes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setUploadModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>
      {quizzes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🧠</Text>
          <Text style={styles.emptyText}>No quizzes yet</Text>
          <Text style={styles.emptySubtext}>Generate quizzes from your study materials</Text>
        </View>
      ) : (
        quizzes.map(quiz => (
          <TouchableOpacity key={quiz.id} style={styles.quizCard}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              <Text style={styles.quizDate}>{quiz.date}</Text>
            </View>
            <Text style={styles.quizInfo}>{quiz.questions} Questions • {quiz.topic}</Text>
            <View style={styles.quizButton}>
              <Text style={styles.quizButtonText}>Start Quiz</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderPlanner = () => (
    <ScrollView style={styles.content}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Study Planner</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      {studyPlans.map(plan => (
        <TouchableOpacity 
          key={plan.id}
          style={styles.plannerCard}
          onPress={() => toggleStudyPlan(plan.id)}
        >
          <View style={styles.planContent}>
            <View style={[styles.checkbox, plan.completed && styles.checkboxCompleted]}>
              {plan.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.planInfo}>
              <Text style={[styles.planSubject, plan.completed && styles.completedText]}>
                {plan.subject}
              </Text>
              <Text style={styles.planTopic}>{plan.topic}</Text>
            </View>
            <Text style={styles.planTime}>{plan.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderAchievements = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.pageTitle}>Achievements</Text>
      <View style={styles.achievementsContainer}>
        {achievements.map(achievement => (
          <View 
            key={achievement.id} 
            style={[
              styles.achievementCardLarge,
              !achievement.unlocked && styles.achievementLocked
            ]}
          >
            <Text style={styles.achievementIconLarge}>{achievement.icon}</Text>
            <Text style={styles.achievementNameLarge}>{achievement.name}</Text>
            {!achievement.unlocked && (
              <Text style={styles.lockedText}>🔒 Locked</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'summaries' && renderSummaries()}
        {activeTab === 'flashcards' && renderFlashcards()}
        {activeTab === 'quiz' && renderQuiz()}
        {activeTab === 'planner' && renderPlanner()}
        {activeTab === 'achievements' && renderAchievements()}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <View style={[styles.navIconContainer, activeTab === 'home' && styles.navIconActive]}>
            <Text style={styles.navIcon}>🏠</Text>
          </View>
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('summaries')}
        >
          <View style={[styles.navIconContainer, activeTab === 'summaries' && styles.navIconActive]}>
            <Text style={styles.navIcon}>📝</Text>
          </View>
          <Text style={[styles.navLabel, activeTab === 'summaries' && styles.navLabelActive]}>Summaries</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('flashcards')}
        >
          <View style={[styles.navIconContainer, activeTab === 'flashcards' && styles.navIconActive]}>
            <Text style={styles.navIcon}>📚</Text>
          </View>
          <Text style={[styles.navLabel, activeTab === 'flashcards' && styles.navLabelActive]}>Cards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('quiz')}
        >
          <View style={[styles.navIconContainer, activeTab === 'quiz' && styles.navIconActive]}>
            <Text style={styles.navIcon}>🧠</Text>
          </View>
          <Text style={[styles.navLabel, activeTab === 'quiz' && styles.navLabelActive]}>Quiz</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveTab('achievements')}
        >
          <View style={[styles.navIconContainer, activeTab === 'achievements' && styles.navIconActive]}>
            <Text style={styles.navIcon}>🏆</Text>
          </View>
          <Text style={[styles.navLabel, activeTab === 'achievements' && styles.navLabelActive]}>Awards</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={uploadModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Notes</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={8}
              placeholder="Paste your notes here or upload a file..."
              value={noteText}
              onChangeText={setNoteText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: primaryColor }]}
                onPress={generateSummary}
              >
                <Text style={styles.modalButtonText}>Generate Summary</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: secondaryColor }]}
                onPress={generateFlashcards}
              >
                <Text style={styles.modalButtonText}>Create Flashcards</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#00a896' }]}
                onPress={generateQuiz}
              >
                <Text style={styles.modalButtonText}>Generate Quiz</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setUploadModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  streakIcon: {
    fontSize: 24,
  },
  streakText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  planCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  plannerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#005c45',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#005c45',
    borderColor: '#005c45',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  planInfo: {
    flex: 1,
    marginLeft: 12,
  },
  planSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  planTopic: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  planTime: {
    fontSize: 14,
    color: '#005c45',
    fontWeight: '600',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  achievementsContainer: {
    marginTop: 16,
  },
  achievementCardLarge: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIconLarge: {
    fontSize: 48,
    marginBottom: 12,
  },
  achievementNameLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  lockedText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#005c45',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryDate: {
    fontSize: 12,
    color: '#005c45',
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  viewButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  viewButtonText: {
    color: '#005c45',
    fontWeight: '600',
    fontSize: 14,
  },
  flashcardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  flashcard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flashcardLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#005c45',
    marginBottom: 4,
  },
  flashcardQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  flashcardDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  flashcardAnswer: {
    fontSize: 14,
    color: '#666',
  },
  quizCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quizDate: {
    fontSize: 12,
    color: '#999',
  },
  quizInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  quizButton: {
    backgroundColor: '#005c45',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quizButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconActive: {
    backgroundColor: '#e6f4f1',
  },
  navIcon: {
    fontSize: 22,
  },
  navLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#005c45',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelButton: {
    marginTop: 12,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
});