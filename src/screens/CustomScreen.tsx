import { useState } from 'react';
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
  onAdd: (input: CustomPracticeInput) => Promise<CustomPracticeItem>;
  onDelete: (id: string, clearCounterTotal: boolean) => Promise<void>;
  onSelectPractice: (item: PracticeItem) => void;
};

export function CustomScreen({
  counterTotals,
  customItems,
  onAdd,
  onDelete,
  onSelectPractice,
}: CustomScreenProps) {
  const [category, setCategory] = useState<EditableCategory>('zikr');
  const [title, setTitle] = useState('');
  const [arabic, setArabic] = useState('');
  const [latin, setLatin] = useState('');
  const [meaning, setMeaning] = useState('');
  const [note, setNote] = useState('');
  const [target, setTarget] = useState('99');

  const resetForm = () => {
    setCategory('zikr');
    setTitle('');
    setArabic('');
    setLatin('');
    setMeaning('');
    setNote('');
    setTarget('99');
  };

  const handleAdd = async () => {
    const cleanTitle = title.trim();
    const cleanArabic = arabic.trim();
    const cleanLatin = latin.trim();
    const cleanMeaning = meaning.trim();
    const cleanNote = note.trim();
    const parsedTarget = Number.parseInt(target, 10);

    if (!cleanTitle) {
      Alert.alert('Başlık gerekli', 'Kayıt için kısa bir başlık yaz.');
      return;
    }

    if (!cleanArabic && !cleanLatin && !cleanMeaning) {
      Alert.alert('Metin gerekli', 'Arapça metin, okunuş veya anlam alanlarından birini doldur.');
      return;
    }

    const item = await onAdd({
      title: cleanTitle,
      arabic: cleanArabic || undefined,
      latin: cleanLatin || undefined,
      meaning: cleanMeaning || undefined,
      note: cleanNote || undefined,
      target: Number.isFinite(parsedTarget) && parsedTarget > 0 ? parsedTarget : undefined,
      category,
    });

    resetForm();
    onSelectPractice(item);
  };

  const confirmDelete = (id: string) => {
    const total = counterTotals[id] ?? 0;

    if (total > 0) {
      Alert.alert(
        'Kayıt silinsin mi?',
        `Bu kayıt için ${total} toplam zikir var. Genel toplam da silinsin mi?`,
        [
          { text: 'Vazgeç', style: 'cancel' },
          {
            text: 'Sadece kaydı sil',
            onPress: () => {
              void onDelete(id, false);
            },
          },
          {
            text: 'Kaydı ve toplamı sil',
            style: 'destructive',
            onPress: () => {
              void onDelete(id, true);
            },
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
        onPress: () => {
          void onDelete(id, false);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Kişisel"
          title="Kendi defterim"
          subtitle="Yeni zikir, dua veya ayet kaydı oluştur."
        />

        <View style={styles.form}>
          <View style={styles.segment}>
            {CATEGORY_OPTIONS.map((option) => {
              const selected = option.value === category;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={option.value}
                  onPress={() => setCategory(option.value)}
                  style={[styles.segmentButton, selected && styles.segmentButtonSelected]}
                >
                  <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            onChangeText={setTitle}
            placeholder="Başlık"
            placeholderTextColor={colors.mutedLight}
            style={styles.input}
            value={title}
          />
          <TextInput
            multiline
            onChangeText={setArabic}
            placeholder="Arapça metin"
            placeholderTextColor={colors.mutedLight}
            style={[styles.input, styles.multiline, styles.rtlInput]}
            textAlignVertical="top"
            value={arabic}
          />
          <TextInput
            multiline
            onChangeText={setLatin}
            placeholder="Okunuş"
            placeholderTextColor={colors.mutedLight}
            style={[styles.input, styles.multiline]}
            textAlignVertical="top"
            value={latin}
          />
          <TextInput
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
              keyboardType="number-pad"
              onChangeText={setTarget}
              placeholder="Hedef"
              placeholderTextColor={colors.mutedLight}
              style={[styles.input, styles.targetInput]}
              value={target}
            />
            <TextInput
              onChangeText={setNote}
              placeholder="Not / kaynak"
              placeholderTextColor={colors.mutedLight}
              style={[styles.input, styles.noteInput]}
              value={note}
            />
          </View>

          <Pressable accessibilityRole="button" onPress={handleAdd} style={styles.addButton}>
            <Text style={styles.addButtonText}>Kaydet ve sayaçta aç</Text>
          </Pressable>
        </View>

        <Text style={styles.blockTitle}>Kayıtlarım</Text>
        {customItems.length > 0 ? (
          customItems.map((item) => (
            <PracticeCard
              item={item}
              key={item.id}
              lifetimeTotal={counterTotals[item.id] ?? 0}
              onDelete={confirmDelete}
              onSelect={onSelectPractice}
            />
          ))
        ) : (
          <EmptyState
            icon="journal-outline"
            text="İlk kişisel zikrini veya ayet kaydını ekleyebilirsin."
            title="Henüz kayıt yok"
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  content: {
    paddingBottom: 112,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
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
    flex: 0.32,
  },
  noteInput: {
    flex: 0.68,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.emerald,
    borderRadius: radius.md,
    height: 50,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  blockTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: spacing.md,
  },
});
