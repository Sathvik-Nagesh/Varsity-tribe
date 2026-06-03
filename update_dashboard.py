import sys

with open('src/app/(app)/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import { useUserStore } from '@/stores/useUserStore';",
    "import { useUserStore, selectPersonaTrack, selectLevel, selectRecommendedActions } from '@/stores/useUserStore';"
)

# Replace destructured usage
old_destructure = '''  const {
    onboardingCompleted,
    personaTrack,
    xp,
    level,
    streak,
    recommendedActions,
    currency,
  } = useUserStore();'''

new_destructure = '''  const { onboardingCompleted, xp, streak, currency } = useUserStore();
  const personaTrack = useUserStore(selectPersonaTrack);
  const level = useUserStore(selectLevel);
  const recommendedActions = useUserStore(selectRecommendedActions);'''

content = content.replace(old_destructure, new_destructure)

with open('src/app/(app)/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard updated")
