const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplaceStringsInDir(dirPath) {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findAndReplaceStringsInDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalContent = content;

            // Typography Updates
            content = content.replace(/(<h[1-4][^>]*className=["'][^"']*)font-serif([^"']*["'])/g, "$1font-sans font-black tracking-tight$2");
            content = content.replace(/(<h[1-4][^>]*className=\{`[^`]*)\bfont-serif\b([^`]*`\})/g, "$1font-sans font-black tracking-tight$2");

            // Grays mapping to new semantic foreground
            content = content.replace(/text-gray-900/g, "text-foreground");
            content = content.replace(/text-gray-800/g, "text-foreground/90");
            content = content.replace(/text-gray-700/g, "text-foreground/80");
            content = content.replace(/text-gray-600/g, "text-foreground/70");
            content = content.replace(/text-gray-500/g, "text-muted-foreground");
            content = content.replace(/text-gray-400/g, "text-muted-foreground/80");

            // Black to foreground
            // Since some text-black might be on buttons... let's check
            content = content.replace(/\btext-black\b/g, "text-foreground");

            // Amber mapping to new semantics
            content = content.replace(/\btext-amber-500\b/g, "text-accent");
            content = content.replace(/\btext-amber-400\b/g, "text-accent");
            content = content.replace(/\btext-amber-600\b/g, "text-primary");
            content = content.replace(/\btext-amber-700\b/g, "text-primary/90");

            content = content.replace(/\bbg-amber-500\b/g, "bg-primary");
            content = content.replace(/\bbg-amber-600\b/g, "bg-primary/90");
            content = content.replace(/\bbg-amber-50\b/g, "bg-primary/5");
            content = content.replace(/\bbg-amber-100\b/g, "bg-primary/10");

            // Update Glassmorphism wrappers manually. But let's automate the most obvious:
            content = content.replace(/bg-white\/80 dark:bg-\[#0a0806\]\/85 backdrop-blur-xl border-b border-neutral-200\/50 dark:border-white\/10 shadow-sm/g, "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg");

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

findAndReplaceStringsInDir(directoryPath);
