import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { PracticeCard } from '../components/PracticeCard';
import { ScrollTopButton } from '../components/ScrollTopButton';
import { ScreenHeader } from '../components/ScreenHeader';
import type { CounterTotals } from '../storage/counterTotals';
import { colors, radius, shadows, spacing } from '../theme';
import { ContentCategory, CustomPracticeInput, CustomPracticeItem, PracticeItem } from '../types';

type EditableCategory = Exclude<ContentCategory, 'esma'>;

const CATEGORY_OPTIONS: { label: string; value: EditableCategory }[] = [
  { label: 'Zikir', value: 'zikr' },
  { label: 'Dua', value: 'dua' },
  { label: 'Ayet', value: 'ayet' },
];

type CustomScreenProps = {
  counterTotals: CounterTotals;
  customItems: CustomPracticeItem[];
  isCustomReady: boolean;
  onAdd: (input: CustomPracticeInput) => Promise<CustomPracticeItem>;
  onDelete: (id: string, clearCounterTotal: boolean) => Promise<void>;
  onSelectPractice: (item: PracticeItem) => void;
  onUpdate: (id: string, input: CustomPracticeInput) => Promise<CustomPracticeItem | undefined>;
};

export function CustomScreen({
  counterTotals,
  customItems,
  isCustomReady,
  onAdd,
  onDelete,
  onSelectPractice,
  onUpdate,
}: CustomScreenProps) {
  const [category, setCategory] = useState<EditableCategory>('zikr');
  const [title, setTitle] = useState('');
  const [arabic, setArabic] = useState('');
  const [latin, setLatin] = useState('');
  const [meaning, setMeaning] = useState('');
  const [note, setNote] = useState('');
  const [target, setTarget] = useState('99');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const resetForm = () => {
    setCategory('zikr');
    setTitle('');
    setArabic('');
    setLatin('');
    setMeaning('');
    setNote('');
    setTarget('99');
  };

  const closeForm = () => {
    resetForm();
    setEditingItemId(null);
    setIsFormOpen(false);
  };

  const openNewForm = () => {
    resetForm();
    setEditingItemId(null);
    setIsFormOpen(true);
    scrollToTop();
  };

  const openEditForm = (item: PracticeItem) => {
    const nextCategory: EditableCategory = item.category === 'esma' ? 'zikr' : item.category;

    setCategory(nextCategory);
    setTitle(item.title);
    setArabic(item.arabic ?? '');
    setLatin(item.latin ?? '');
    setMeaning(item.meaning ?? '');
    setNote(item.note ?? '');
    setTarget(item.target ? String(item.target) : '');
    setEditingItemId(item.id);
    setIsFormOpen(true);
    scrollToTop();
  };

  const buildInput = (): CustomPracticeInput | undefined => {
    const cleanTitle = title.trim();
    const cleanArabic = arabic.trim();
    const cleanLatin = latin.trim();
    const cleanMeaning = meaning.trim();
    const cleanNote = note.trim();
    const parsedTarget = Number.parseInt(target, 10);

    if (!cleanTitle) {
      Alert.alert('Başlık gerekli', 'Kayıt için kısa bir başlık yaz.');
      return undefined;
    }

    if (!cleanArabic && !cleanLatin && !cleanMeaning) {
      Alert.alert('Metin gerekli', 'Arapça metin, okunuş veya anlam alanlarından birini doldur.');
      return undefined;
    }

    return {
      title: cleanTitle,
      arabic: cleanArabic || undefined,
      latin: cleanLatin || undefined,
      meaning: cleanMeaning || undefined,
      note: cleanNote || undefined,
      target: Number.isFinite(parsedTarget) && parsedTarget > 0 ? parsedTarget : undefined,
      category,
    };
  };

  const handleSubmit = async () => {
    if (!isCustomReady) {
      Alert.alert('Kayıtlar hazırlanıyor', 'Kişisel kayıtlar yüklenmeden değişiklik yapılamaz.');
      return;
    }

    const input = buildInput();

    if (!input) {
      return;
    }

    if (editingItemId) {
      const updatedItem = await onUpdate(editingItemId, input);

      if (!updatedItem) {
        Alert.alert('Kayıt bulunamadı', 'Düzenlemek istediğin kayıt artık listede yok.');
        closeForm();
        return;
      }

      closeForm();
      return;
    }

    await onAdd(input);
    closeForm();
  };

  const handleDelete = (id: string, clearCounterTotal: boolean) => {
    if (editingItemId === id) {
      closeForm();
    }

    void onDelete(id, clearCounterTotal);
  };

  const confirmDelete = (id: string) => {
    if (!isCustomReady) {
      Alert.alert('Kayıtlar hazırlanıyor', 'Kişisel kayıtlar yüklenmeden silme yapılamaz.');
      return;
    }

    const total = counterTotals[id] ?? 0;

    if (total > 0) {
      Alert.alert(
        'Kayıt silinsin mi?',
        `Bu kayıt için ${total} toplam zikir var. Genel toplam da silinsin mi?`,
        [
          { text: 'Vazgeç', style: 'cancel' },
          {
            text: 'Sadece kaydı sil',
            onPress: () => handleDelete(id, false),
          },
          {
            text: 'Kaydı ve toplamı sil',
            style: 'destructive',
            onPress: () => handleDelete(id, true),
          },
        ],
      );
      return;
    }

    Alert.alert('Kayıt silinsin mi?', 'Bu işlem kişisel kaydı kaldırır.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => handleDelete(id, false),
      },
    ]);
  };

  const toggleForm = () => {
    if (!isCustomReady) {
      return;
    }

    if (isFormOpen) {
      closeForm();
      return;
    }

    openNewForm();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboard}
    >
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          onScroll={(event) => setShowScrollTop(event.nativeEvent.contentOffset.y > 420)}
          ref={scrollRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            eyebrow="Kişisel"
            title="Kendi defterim"
            subtitle="Kayıtlarını gör, gerekirse düzenle veya yeni bir kayıt ekle."
          />

          <View style={styles.listHeader}>
            <Text style={styles.blockTitle}>Kayıtlarım</Text>
            <Pressable
              accessibilityRole="button"
              disabled={!isCustomReady}
              onPress={toggleForm}
              style={[
                styles.toggleButton,
                isFormOpen && styles.toggleButtonOpen,
                !isCustomReady && styles.disabledControl,
              ]}
            >
              <Ionicons
                color={isFormOpen ? colors.muted : colors.surface}
                name={isFormOpen ? 'chevron-up' : 'add'}
                size={18}
              />
              <Text style={[styles.toggleText, isFormOpen && styles.toggleTextMuted]}>
                {isFormOpen ? 'Kapat' : 'Yeni kayıt'}
              </Text>
            </Pressable>
          </View>

          {isFormOpen ? (
            <View style={styles.form}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>
                  {editingItemId ? 'Kaydı düzenle' : 'Yeni kayıt'}
                </Text>
                <Pressable accessibilityRole="button" onPress={closeForm} style={styles.closeButton}>
                  <Ionicons color={colors.muted} name="close" size={20} />
                </Pressable>
              </View>

              <View style={styles.segment}>
                {CATEGORY_OPTIONS.map((option) => {
                  const selected = option.value === category;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      disabled={!isCustomReady}
                      key={option.value}
                      onPress={() => setCategory(option.value)}
                      style={[
                        styles.segmentButton,
                        selected && styles.segmentButtonSelected,
                        !isCustomReady && styles.disabledControl,
                      ]}
                    >
                      <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <TextInput
                editable={isCustomReady}
                onChangeText={setTitle}
                placeholder="Başlık"
                placeholderTextColor={colors.mutedLight}
                style={styles.input}
                value={title}
              />
              <TextInput
                editable={isCustomReady}
                multiline
                onChangeText={setArabic}
                placeholder="Arapça metin"
                placeholderTextColor={colors.mutedLight}
                style={[styles.input, styles.multiline, styles.rtlInput]}
                textAlignVertical="top"
                value={arabic}
              />
              <TextInput
                editable={isCustomReady}
                multiline
                onChangeText={setLatin}
                placeholder="Okunuş"
                placeholderTextColor={colors.mutedLight}
                style={[styles.input, styles.multiline]}
                textAlignVertical="top"
                value={latin}
              />
              <TextInput
                editable={isCustomReady}
                multiline
                onChangeText={setMeaning}
                placeholder="Anlam"
                placeholderTextColor={colors.mutedLight}
                style={[styles.input, styles.multiline]}
                textAlignVertical="top"
                value={meaning}
              />
              <View style={styles.row}>
                <TextInput
                  editable={isCustomReady}
                  keyboardType="number-pad"
                  onChangeText={setTarget}
                  placeholder="Hedef"
                  placeholderTextColor={colors.mutedLight}
                  style={[styles.input, styles.targetInput]}
                  value={target}
                />
                <TextInput
                  editable={isCustomReady}
                  onChangeText={setNote}
                  placeholder="Not / kaynak"
                  placeholderTextColor={colors.mutedLight}
                  style={[styles.input, styles.noteInput]}
                  value={note}
                />
              </View>

              <View style={styles.formActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={closeForm}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Vazgeç</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={!isCustomReady}
                  onPress={handleSubmit}
                  style={[styles.addButton, !isCustomReady && styles.disabledControl]}
                >
                  <Text style={styles.addButtonText}>
                    {editingItemId ? 'Güncelle' : 'Kaydet'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {!isCustomReady ? (
            <EmptyState
              icon="hourglass-outline"
              text="Kişisel kayıtların cihazdan yükleniyor."
              title="Kayıtlar hazırlanıyor"
            />
          ) : customItems.length > 0 ? (
            customItems.map((item) => (
              <PracticeCard
                item={item}
                key={item.id}
                lifetimeTotal={counterTotals[item.id] ?? 0}
                onDelete={confirmDelete}
                onEdit={openEditForm}
                onSelect={onSelectPractice}
              />
            ))
          ) : (
            <EmptyState
              icon="journal-outline"
              text="Yeni kayıt ekleyerek kendi defterini oluşturabilirsin."
              title="Henüz kayıt yok"
            />
          )}
        </ScrollView>
        <ScrollTopButton onPress={scrollToTop} visible={showScrollTop} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 112,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  blockTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  toggleButton: {
    alignItems: 'center',
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  toggleButtonOpen: {
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
  },
  toggleText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  toggleTextMuted: {
    color: colors.muted,
  },
  form: {
    ...shadows.soft,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  formHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  segment: {
    backgroundColor: colors.surfaceTint,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    height: 38,
    justifyContent: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: colors.emerald,
  },
  segmentText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  segmentTextSelected: {
    color: colors.surface,
  },
  input: {
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 46,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  multiline: {
    minHeight: 82,
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  targetInput: {
    flexGrow: 0,
    width: 88,
  },
  noteInput: {
    flex: 1,
    minWidth: 0,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.emerald,
    borderRadius: radius.md,
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 0.72,
    height: 50,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  disabledControl: {
    opacity: 0.55,
  },
});
