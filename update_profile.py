import sys

with open('src/app/(app)/profile/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { useUserStore } from '@/stores/useUserStore';",
    "import { useUserStore, selectLevel } from '@/stores/useUserStore';"
)

content = content.replace(
    "const { xp, level, streak } = useUserStore();",
    "const { xp, streak } = useUserStore();\n  const level = useUserStore(selectLevel);"
)

with open('src/app/(app)/profile/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Profile updated")
