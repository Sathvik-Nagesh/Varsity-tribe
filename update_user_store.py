import re

with open('src/stores/useUserStore.ts', 'r') as f:
    content = f.read()

# Remove derived fields from UserState
content = re.sub(r'  // Derived\n  riskProfile: RiskProfile;\n  personaTrack: PersonaTrack;\n  recommendedActions: string\[\];\n  dashboardLayout: DashboardSection\[\];\n', '', content)
content = re.sub(r'  level: UserLevel;\n', '', content)

# Remove derived fields from initial state
content = re.sub(r"      // Derived \(defaults before onboarding\)\n      riskProfile: 'moderate',\n      personaTrack: 'young-professional',\n      recommendedActions: \[\],\n      dashboardLayout: computeDashboardLayout\('young-professional'\),\n", '', content)
content = re.sub(r"      level: 'seedling',\n", '', content)

# Modify completeOnboarding
old_complete = '''      completeOnboarding: (answers) => {
        const riskProfile = computeRiskProfile(answers.riskComfort, answers.investmentExperience);
        const personaTrack = computePersonaTrack(answers.ageBracket, answers.incomeRange);
        const recommendedActions = computeRecommendedActions(personaTrack, answers.currentGoals);
        const dashboardLayout = computeDashboardLayout(personaTrack);

        set({
          onboardingAnswers: answers,
          onboardingCompleted: true,
          riskProfile,
          personaTrack,
          recommendedActions,
          dashboardLayout,
        });
      },'''
new_complete = '''      completeOnboarding: (answers) => {
        set({
          onboardingAnswers: answers,
          onboardingCompleted: true,
        });
      },'''
content = content.replace(old_complete, new_complete)

# Modify addXP
old_addxp = '''      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = computeLevel(newXP);
          
          if (newLevel !== state.level) {'''
new_addxp = '''      addXP: (amount) =>
        set((state) => {
          const currentLevel = computeLevel(state.xp);
          const newXP = state.xp + amount;
          const newLevel = computeLevel(newXP);
          
          if (newLevel !== currentLevel) {'''
content = content.replace(old_addxp, new_addxp)

old_returnxp = '''          return { xp: newXP, level: newLevel };
        }),'''
new_returnxp = '''          return { xp: newXP };
        }),'''
content = content.replace(old_returnxp, new_returnxp)

# Add selectors
selectors = '''
// --- Selectors -------------------------------------------------------
export const selectRiskProfile = (state: UserState) => computeRiskProfile(state.onboardingAnswers.riskComfort, state.onboardingAnswers.investmentExperience);
export const selectPersonaTrack = (state: UserState) => computePersonaTrack(state.onboardingAnswers.ageBracket, state.onboardingAnswers.incomeRange);
export const selectRecommendedActions = (state: UserState) => computeRecommendedActions(selectPersonaTrack(state), state.onboardingAnswers.currentGoals);
export const selectDashboardLayout = (state: UserState) => computeDashboardLayout(selectPersonaTrack(state));
export const selectLevel = (state: UserState) => computeLevel(state.xp);
'''
content += selectors

with open('src/stores/useUserStore.ts', 'w') as f:
    f.write(content)

print("Done")
