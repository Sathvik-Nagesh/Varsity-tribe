import re

# Future You
with open('src/app/(app)/learn/future-you/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r'\s*triggerConfetti\(\);', '', code)
code = re.sub(r'\s*const triggerConfetti = async \(\) => \{.*?frame\(\);\s*\};', '', code, flags=re.DOTALL)

with open('src/app/(app)/learn/future-you/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

# Salary Negotiation
with open('src/app/(app)/learn/salary-negotiation/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r'\s*triggerConfetti\(\);', '', code)
code = re.sub(r'\s*const triggerConfetti = async \(\) => \{.*?frame\(\);\s*\};', '', code, flags=re.DOTALL)

with open('src/app/(app)/learn/salary-negotiation/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

