import os
import re

tool_files = [
    r"d:\Brandex_Projects\varsity-tribe\src\app\(app)\tools\sip\page.tsx",
    r"d:\Brandex_Projects\varsity-tribe\src\app\(app)\tools\emi\page.tsx",
    r"d:\Brandex_Projects\varsity-tribe\src\app\(app)\tools\retirement\page.tsx",
    r"d:\Brandex_Projects\varsity-tribe\src\app\(app)\tools\portfolio\page.tsx",
]

breadcrumb = """
        <div className="pt-6 pb-2">
          <Link href="/tools" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
            Back to Tools Hub
          </Link>
        </div>
"""

for file in tool_files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Inject Link import if not present
        if "import Link from 'next/link';" not in content:
            content = content.replace("import { useState }", "import Link from 'next/link';\nimport { useState }")
            
        # Replace first <Container> with <Container> + breadcrumb
        if '<Container className=' in content:
            content = re.sub(r'(<Container[^>]*>)', r'\1' + breadcrumb, content, count=1)
        else:
            content = re.sub(r'(<Container>)', r'\1' + breadcrumb, content, count=1)
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
