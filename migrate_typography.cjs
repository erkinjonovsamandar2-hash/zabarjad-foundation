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

            // Typography Updates: Replace font-sans font-black with font-heading font-black etc
            content = content.replace(/font-sans\s+font-black/g, "font-heading font-black");
            content = content.replace(/font-sans\s+font-extrabold/g, "font-heading font-extrabold");
            content = content.replace(/font-sans\s+font-bold/g, "font-heading font-bold");

            // To be safe, let's reverse any accidental double font-headings
            content = content.replace(/font-heading\s+font-heading/g, "font-heading");

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

findAndReplaceStringsInDir(directoryPath);
