const fs = require('fs');
const path = require('path');

const emailTemplatePath = path.join(__dirname, 'utils', 'EmailTemplate.js');
let content = fs.readFileSync(emailTemplatePath, 'utf8');

// The user wants the color from the 1st image, which is the button color / original header color.
// That color is #5555ff based on previous file reads of Verification_Email_Template.
const targetColor = "#5555ff";

// Replace Dark Blue #00008B with Brand Blue #5555ff
content = content.replace(/#00008B/g, targetColor);

// Also Ensure OTP code text is consistent
content = content.replace(/color: #00008B/g, `color: ${targetColor}`);

fs.writeFileSync(emailTemplatePath, content);
console.log(`Updated Email Templates to Brand Blue (${targetColor})`);
