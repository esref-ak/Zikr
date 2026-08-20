import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { AYAH_DUA_LIBRARY, ESMA_UL_HUSNA, READY_ZIKR } from '../data/presets';
import type { CounterTotals } from '../storage/counterTotals';
import { colors, radius, shadows, spacing } from '../theme';
import { PracticeItem, TabKey } from '../types';

const COMFORT_REFLECTIONS = [
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    kind: 'Ayet',
    source: 'Bakara 2/152',
    text: 'Beni anın ki Ben de sizi anayım.',
  },
  {
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    kind: 'Ayet',
    source: 'Tâhâ 20/114',
    text: 'Rabbim, ilmimi artır.',
  },
  {
    arabic: 'أَلَا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ',
    kind: 'Ayet',
    source: 'Ra’d 13/28',
    text: 'Kalpler ancak Allah’ı anmakla huzur bulur.',
  },
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    kind: 'Ayet',
    source: 'İnşirâh 94/5',
    text: 'Şüphesiz zorlukla beraber bir kolaylık vardır.',
  },
  {
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    kind: 'Hadis',
    source: 'Buhârî, Bed’ü’l-vahy 1',
    text: 'Ameller niyetlere göredir.',
  },
  {
    arabic: 'يَسِّرُوا وَلَا تُعَسِّرُوا',
    kind: 'Hadis',
    source: 'Buhârî, İlim 11',
    text: 'Kolaylaştırın, zorlaştırmayın.',
  },
  {
    arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    kind: 'Hadis',
    source: 'Tirmizî, Deavât 1',
    text: 'Dua ibadetin özüdür.',
  },
];

function getComfortReflection() {
  const index = Math.floor(Math.random() * COMFORT_REFLECTIONS.length);

  return COMFORT_REFLECTIONS[index];
}

type HomeScreenProps = {
  activePractice: PracticeItem;
  counterTotals: CounterTotals;
  customCount: number;
  onNavigate: (tab: TabKey) => void;
};

export function HomeScreen({
  activePractice,
  counterTotals,
  customCount,
  onNavigate,
}: HomeScreenProps) {
  const activePracticeTotal = counterTotals[activePractice.id] ?? 0;
  const comfortReflection = useMemo(() => getComfortReflection(), []);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        eyebrow="Zikr"
        title="Kalbin zikirle tazelensin"
        subtitle="Hazır zikirler, Esmâü'l-Hüsna ve kişisel kayıtların tek yerde."
      />

      <LinearGradient
        colors={[colors.emeraldDark, '#0A5D50', colors.emerald]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.comfortCard}
      >
        <View style={styles.comfortHeader}>
          <View style={styles.dailyIcon}>
            <Ionicons color={colors.goldSoft} name="book-outline" size={18} />
          </View>
          <View style={styles.dailyMeta}>
            <Text style={styles.dailyLabel}>Kalbe ferahlık</Text>
            <Text style={styles.dailySource}>
              {comfortReflection.kind} • {comfortReflection.source}
            </Text>
          </View>
        </View>
        <Text style={styles.dailyArabic}>{comfortReflection.arabic}</Text>
        <Text style={styles.dailyText}>{comfortReflection.text}</Text>
      </LinearGradient>

      <View style={styles.overviewPanel}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onNavigate('counter')}
          style={styles.activePanel}
        >
          <View style={styles.activeIcon}>
            <Ionicons color={colors.surface} name="radio-button-on" size={22} />
          </View>
          <View style={styles.activeCopy}>
            <Text style={styles.activeLabel}>Aktif sayaç</Text>
            <Text style={styles.activeTitle} numberOfLines={2}>
              {activePractice.title}
            </Text>
            <Text style={styles.activeTotal}>Toplam zikrin: {activePracticeTotal}</Text>
          </View>
          <View style={styles.activeMeta}>
            <Text style={styles.activeTarget}>{activePractice.target ?? 99}</Text>
            <Ionicons color={colors.mutedLight} name="chevron-forward" size={19} />
          </View>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{READY_ZIKR.length + AYAH_DUA_LIBRARY.length}</Text>
            <Text style={styles.statLabel}>Hazır</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{ESMA_UL_HUSNA.length}</Text>
            <Text style={styles.statLabel}>Esmâ</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{customCount}</Text>
            <Text style={styles.statLabel}>Defter</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionGrid}>
        <SectionCard
          accent={colors.teal}
          icon="book-outline"
          meta={`${READY_ZIKR.length + AYAH_DUA_LIBRARY.length} hazır kayıt`}
          onPress={() => onNavigate('library')}
          subtitle="Zikir, dua ve ayet seçkisi."
          title="Hazır İçerikler"
        />
        <SectionCard
          accent={colors.gold}
          icon="sparkles-outline"
          meta="99 isim"
          onPress={() => onNavigate('asma')}
          subtitle="Arapça, okunuş ve anlam."
          title="Esmâü'l-Hüsna"
        />
        <SectionCard
          accent={colors.rose}
          icon="add-circle-outline"
          meta={`${customCount} kişisel kayıt`}
          onPress={() => onNavigate('custom')}
          subtitle="Zikir, dua veya ayet ekle."
          title="Kendi Defterim"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  comfortCard: {
    ...shadows.soft,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  comfortHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dailyIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(244, 226, 184, 0.32)',
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  dailyMeta: {
    flex: 1,
  },
  dailyLabel: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  dailySource: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  dailyArabic: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: spacing.sm,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dailyText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  overviewPanel: {
    ...shadows.soft,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBox: {
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  statValue: {
    color: colors.emerald,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  activePanel: {
    alignItems: 'center',
    backgroundColor: colors.surfaceTint,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  activeIcon: {
    alignItems: 'center',
    backgroundColor: colors.emerald,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  activeCopy: {
    flex: 1,
  },
  activeLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  activeTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
    letterSpacing: 0,
    marginTop: 2,
  },
  activeTotal: {
    color: colors.emerald,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 3,
  },
  activeTarget: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  activeMeta: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: 4,
  },
  sectionGrid: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});
