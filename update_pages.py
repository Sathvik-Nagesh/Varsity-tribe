import os
import glob
import re

base_dir = "d:/Brandex_Projects/varsity-tribe/src/app/(app)"
files = glob.glob(f"{base_dir}/**/page.tsx", recursive=True)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "PageLayout" in content:
        continue
        
    # Add import
    import_stmt = "import { PageLayout } from '@/components/layout/PageLayout';\n"
    
    # insert after the last import
    imports_end = 0
    for match in re.finditer(r'^import .*?;?', content, re.MULTILINE):
        imports_end = match.end()
    
    if imports_end > 0:
        content = content[:imports_end] + "\n" + import_stmt + content[imports_end:]
    else:
        content = import_stmt + content

    # Find export default function
    # We want to replace the first return in the main component.
    # We'll use regex to find `export default function \w+\(.*?\)\s*\{`
    match = re.search(r'export default function \w+\(.*?\)\s*\{', content)
    if match:
        func_start = match.end()
        # Find the main return statement of this function.
        # This is somewhat brittle if there are early returns, but we can look for `return (`
        # that is at the lowest indentation, or just find `return (` after the last early return.
        
        # An easier way: just look for the last `return (` or `return <` in the file.
        # usually pages have their main return at the end.
        main_return_match = list(re.finditer(r'^\s*return\s*\(', content, re.MULTILINE))
        if not main_return_match:
            main_return_match = list(re.finditer(r'^\s*return\s*<', content, re.MULTILINE))
        
        if main_return_match:
            last_return = main_return_match[-1]
            ret_start = last_return.start()
            
            # The structure is usually:
            # return (
            #   <Something>
            #   </Something>
            # );
            # We want to wrap it like:
            # return (
            #   <PageLayout>
            #     <Something>
            #     </Something>
            #   </PageLayout>
            # );
            
            # extract everything after the return to the end of the component
            # we can just find the matching parenthesis of return ( ... ) or if it's return < ... >;
            pass

print("done")
