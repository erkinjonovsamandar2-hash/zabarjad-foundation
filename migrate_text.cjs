const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplaceStringsInDir(dirPath) {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findAndReplaceStringsInDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalContent = content;

            content = content.replace(/Eng Yaxshisini Ilinamiz/g, "Kitobsevarlar uchun yangi olam");
            // Match cases
            content = content.replace(/Zabarjad Media/g, "Booktopia");
            content = content.replace(/zabarjad media/g, "booktopia");
            content = content.replace(/Zabarjad\s*Media/g, "Booktopia");
            content = content.replace(/Zabarjad/g, "Booktopia");
            content = content.replace(/zabarjadmedia/g, "booktopia");
            content = content.replace(/zabarjad/g, "booktopia");
            content = content.replace(/BooktopiaBird/g, "BooktopiaLogo");
            content = content.replace(/booktopiaBird/g, "BooktopiaLogo");
            // booktopiaLogo is created from zabarjadLogo. Make sure BooktopiaLogo is capitalized where imported.
            content = content.replace(/import booktopiaLogo from/g, "import BooktopiaLogo from");
            content = content.replace(/\bbooktopiaLogo\b/g, "BooktopiaLogo");

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

findAndReplaceStringsInDir(directoryPath);
