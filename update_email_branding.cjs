const fs = require('fs');
const path = require('path');

const emailTemplatePath = path.join(__dirname, 'utils', 'EmailTemplate.js');
let content = fs.readFileSync(emailTemplatePath, 'utf8');

// Replace OTP Template Colors
content = content.replace(/background: #fff0eb/g, "background: #e6f0ff"); // Lighter blue bg for OTP
content = content.replace(/border: 2px dashed #FF5733/g, "border: 2px dashed #00008B"); // Dark Blue Border
content = content.replace(/color: #FF5733/g, "color: #00008B"); // Dark Blue Text key
content = content.replace(/background-color: #FF5733/g, "background-color: #00008B"); // Dark Blue Header

// Replace Success Template Colors
content = content.replace(/background-color: #28a745/g, "background-color: #00008B"); // Dark Blue Header instead of Green

// Change Footer Text
content = content.replace(/AI Mall/g, "A-Series");

fs.writeFileSync(emailTemplatePath, content);
console.log("Updated Email Templates to Dark Blue and A-Series branding.");
