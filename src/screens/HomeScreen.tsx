import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PracticeCard } from '../components/PracticeCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { AYAH_DUA_LIBRARY, ESMA_UL_HUSNA, READY_ZIKR } from '../data/presets';
import type { CounterTotals } from '../storage/counterTotals';
import { colors, radius, shadows, spacing } from '../theme';
import { PracticeItem, TabKey } from '../types';

type HomeScreenProps = {
  activePractice: PracticeItem;
  counterTotals: CounterTotals;
  customCount: number;
  onNavigate: (tab: TabKey) => void;
  onSelectPractice: (item: PracticeItem) => void;
};

export function HomeScreen({
  activePractice,
  counterTotals,
  customCount,
  onNavigate,
  onSelectPractice,
}: HomeScreenProps) {
  const activePracticeTotal = counterTotals[activePractice.id] ?? 0;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        eyebrow="Zikr"
        title="Kalbin zikirle tazelensin"
        subtitle="Hazır zikirler, Esmâü'l-Hüsna ve kişisel kayıtların tek yerde."
      />

      <LinearGradient colors={[colors.emeraldDark, colors.emerald]} style={styles.hero}>
        <Text style={styles.bismillah}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</Text>
        <Text style={styles.heroTitle}>فَاذْكُرُونِي أَذْكُرْكُمْ</Text>
        <Text style={styles.heroText}>Beni anın ki Ben de sizi anayım.</Text>
        <Text style={styles.heroNote}>Bakara 2/152</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{READY_ZIKR.length}</Text>
          <Text style={styles.statLabel}>Hazır zikir</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{ESMA_UL_HUSNA.length}</Text>
          <Text style={styles.statLabel}>Esmâ</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{customCount}</Text>
          <Text style={styles.statLabel}>Kayıtlı</Text>
        </View>
      </View>

      <View style={styles.activePanel}>
        <View style={styles.activeIcon}>
          <Ionicons color={colors.surface} name="radio-button-on" size={22} />
        </View>
        <View style={styles.activeCopy}>
          <Text style={styles.activeLabel}>Aktif sayaç</Text>
          <Text style={styles.activeTitle}>{activePractice.title}</Text>
          <Text style={styles.activeTotal}>Toplam zikrin: {activePracticeTotal}</Text>
        </View>
        <Text style={styles.activeTarget}>{activePractice.target ?? 99}</Text>
      </View>

      <View style={styles.sectionGrid}>
        <SectionCard
          accent={colors.emerald}
          icon="radio-button-on-outline"
          meta={`${activePractice.target ?? 99} hedef`}
          onPress={() => onNavigate('counter')}
          subtitle="Tek dokunuşla say, hedefe yaklaş."
          title="Sayaç"
        />
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

      <Text style={styles.blockTitle}>Öne çıkan zikirler</Text>
      {READY_ZIKR.slice(0, 3).map((item) => (
        <PracticeCard
          item={item}
          key={item.id}
          lifetimeTotal={counterTotals[item.id] ?? 0}
          onSelect={onSelectPractice}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  hero: {
    ...shadows.soft,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  bismillah: {
    color: colors.goldSoft,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 44,
    marginTop: spacing.md,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  heroText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  heroNote: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statBox: {
    ...shadows.soft,
    backgroundColor: colors.surface,
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
    marginBottom: spacing.md,
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
    fontSize: 17,
    fontWeight: '900',
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
  sectionGrid: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  blockTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: spacing.md,
  },
});
