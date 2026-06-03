import sys

with open('src/app/onboarding/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { useUserStore } from '@/stores/useUserStore';",
    "import { useUserStore, selectRiskProfile, selectPersonaTrack, selectRecommendedActions } from '@/stores/useUserStore';"
)

old_destructure = '''  const { completeOnboarding, riskProfile, personaTrack, recommendedActions, setCurrency, currency: currencyStore } =
    useUserStore();'''

new_destructure = '''  const { completeOnboarding, setCurrency, currency: currencyStore } = useUserStore();
  const riskProfile = useUserStore(selectRiskProfile);
  const personaTrack = useUserStore(selectPersonaTrack);
  const recommendedActions = useUserStore(selectRecommendedActions);'''

content = content.replace(old_destructure, new_destructure)

with open('src/app/onboarding/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Onboarding updated")
