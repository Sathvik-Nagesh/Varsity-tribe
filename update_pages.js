const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const sourceFiles = project.getSourceFiles("src/app/(app)/**/page.tsx");

sourceFiles.forEach(sourceFile => {
  // Check if PageLayout is already imported
  const hasPageLayout = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === '@/components/layout/PageLayout');
  
  if (!hasPageLayout) {
    sourceFile.addImportDeclaration({
      namedImports: ['PageLayout'],
      moduleSpecifier: '@/components/layout/PageLayout'
    });
  }

  const defaultExport = sourceFile.getDefaultExportSymbol();
  if (defaultExport) {
    const decls = defaultExport.getDeclarations();
    const funcDecl = decls.find(d => d.getKind() === SyntaxKind.FunctionDeclaration);
    if (funcDecl) {
      // Find the return statement inside the function body
      const returnStatements = funcDecl.getDescendantsOfKind(SyntaxKind.ReturnStatement);
      const body = funcDecl.getBody();
      if (body) {
         const statements = body.getStatements();
         const mainReturn = statements.find(s => s.getKind() === SyntaxKind.ReturnStatement);
         if (mainReturn) {
             const expr = mainReturn.getExpression();
             if (expr && (expr.getKind() === SyntaxKind.ParenthesizedExpression || expr.getKind() === SyntaxKind.JsxElement || expr.getKind() === SyntaxKind.JsxFragment)) {
                 
                 // If it's already wrapped in PageLayout, skip
                 if (expr.getText().includes('<PageLayout>')) {
                     return;
                 }
                 
                 // Replace the expression with <PageLayout>{expr}</PageLayout>
                 const newExpr = `return (\n<PageLayout>\n${expr.getText()}\n</PageLayout>\n);`;
                 mainReturn.replaceWithText(newExpr);
             }
         }
      }
    }
  }
});

project.saveSync();
console.log("Updated files.");
