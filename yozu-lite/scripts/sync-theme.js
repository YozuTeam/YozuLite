const fs = require("fs");
const path = require("path");

const CONSTANT_FILE = path.join(__dirname, "../src/theme/constant.ts");
const GLOBALS_CSS_FILE = path.join(__dirname, "../src/app/globals.css");

function extractTheme() {
  const content = fs.readFileSync(CONSTANT_FILE, "utf8");

  const lightMatch = content.match(/light:\s*{([^}]+)}/);
  const darkMatch = content.match(/dark:\s*{([^}]+)}/);

  if (!lightMatch || !darkMatch) {
    console.error("Could not parse NAV_THEME from constant.ts");
    process.exit(1);
  }

  const parseColors = (str) => {
    const colors = {};
    const lines = str.split("\n");
    for (const line of lines) {
      const match = line.match(/(\w+):\s*['"]hsl\(([^)]+)\)['"]/);
      if (match) {
        const key = match[1];
        const value = match[2];
        let cssKey = "--" + key.replace(/([A-Z])/g, "-$1").toLowerCase();

        if (key === "text") cssKey = "--foreground";
        if (key === "notification") cssKey = "--destructive";
        if (key === "notificationForeground")
          cssKey = "--destructive-foreground";

        colors[cssKey] = value;
      }
    }
    return colors;
  };

  return {
    light: parseColors(lightMatch[1]),
    dark: parseColors(darkMatch[1]),
  };
}

function generateCSS(theme) {
  let css = `@import "tailwindcss";
@config "../../tailwind.config.ts";

@layer base {
  :root {
`;

  for (const [key, value] of Object.entries(theme.light)) {
    css += `    ${key}: ${value};\n`;
  }

  if (!theme.light["--radius"]) {
    css += `    --radius: 0.5rem;\n`;
  }

  css += `  }

  .dark {
`;

  for (const [key, value] of Object.entries(theme.dark)) {
    css += `    ${key}: ${value};\n`;
  }

  css += `  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;

  return css;
}

function main() {
  try {
    console.log("Reading theme constants...");
    const theme = extractTheme();

    console.log("Generating CSS...");
    const css = generateCSS(theme);

    console.log("Writing globals.css...");
    fs.writeFileSync(GLOBALS_CSS_FILE, css);

    console.log("Theme synchronization complete!");
  } catch (error) {
    console.error("Error syncing theme:", error);
    process.exit(1);
  }
}

main();
