import os
import glob
import re

base_dir = "d:/Brandex_Projects/varsity-tribe/src/app/(app)"
files = glob.glob(f"{base_dir}/**/page.tsx", recursive=True)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to fix the issue where it looks like:
    # return (
    # <PageLayout>
    # (
    #    <Something>
    # )
    # </PageLayout>
    # );
    
    # We can use regex to replace:
    # return (
    # <PageLayout>
    # (
    
    # or something similar.
    # Actually, the exact string is:
    # return (
    # <PageLayout>
    # (
    # ...
    # )
    # </PageLayout>
    # );
    
    # Let's just fix it using a simpler regex.
    # Find `<PageLayout>\s*\(` and replace with `<PageLayout>\n`
    # Find `\)\s*</PageLayout>` and replace with `\n</PageLayout>`
    
    content = re.sub(r'<PageLayout>\s*\(', '<PageLayout>', content)
    content = re.sub(r'\)\s*</PageLayout>', '</PageLayout>', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("done")
