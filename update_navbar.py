import sys

with open('src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { useUserStore } from '@/stores/useUserStore';",
    "import { useUserStore, selectLevel } from '@/stores/useUserStore';"
)

content = content.replace(
    "const { level } = useUserStore();",
    "const level = useUserStore(selectLevel);"
)

with open('src/components/layout/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Navbar updated")
