/**
 * Body Color Change on Scroll
 */

function initBodyColorChange(wasPageTransition) {
  // attribute value checker
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  const colorThemes = [];
  const htmlStyles = getComputedStyle(document.documentElement);
  const targetStylesheet = document.querySelector("#color-themes");
  const regex = /--([^:\s]+):\s*var\(--([^)]+)\);/g;

  if (targetStylesheet) {
    const rules =
      targetStylesheet.sheet.cssRules || targetStylesheet.sheet.rules;

    for (const rule of rules) {
      const styleObject = {};
      let match;
      while ((match = regex.exec(rule.cssText)) !== null) {
        const key = "--" + match[1];
        const value = htmlStyles.getPropertyValue("--" + match[2]);
        styleObject[key] = value;
      }
      colorThemes.push(styleObject);
    }

    const firstSectionThemeValue = document
      .querySelector("[animate-body-to]")
      ?.getAttribute("animate-body-to");

    if (wasPageTransition) {
      console.log("setting color for page transition");
      const bodyThemeColor = Number(
        document.body.getAttribute("element-theme")
      );

      console.log({ bodyThemeColor });
      gsap.set(document.body, {
        backgroundColor: colorThemes[bodyThemeColor - 1]["--color--background"],
        color: colorThemes[bodyThemeColor - 1]["--color--text"],
      });
    }

    if (firstSectionThemeValue && !wasPageTransition) {
      console.log("setting first section color theme");
      gsap.set(document.body, {
        backgroundColor:
          colorThemes[firstSectionThemeValue - 1]["--color--background"],
        color: colorThemes[firstSectionThemeValue - 1]["--color--text"],
      });
    }

    const breakpointSetting = attr(
      0,
      targetStylesheet.getAttribute("min-width")
    );
    gsap.registerPlugin(ScrollTrigger);

    const triggerElements = document.querySelectorAll("[animate-body-to]");

    triggerElements.forEach((element, index) => {
      const offsetSetting = attr("50%", element.getAttribute("offet"));

      const themeIndex = Number(element.getAttribute("animate-body-to")) || 1;
      let endSetting = `clamp(bottom ${offsetSetting})`;
      if (index === triggerElements.length - 1)
        endSetting = `bottom ${offsetSetting}`;

      const bgColor =
        colorThemes[themeIndex - 1]["--color--background"] || "#ffffff";

      const textColor =
        colorThemes[themeIndex - 1]["--color--text"] || "#121212";

      // Set up the ScrollTrigger
      ScrollTrigger.create({
        trigger: element,
        start: `clamp(top ${offsetSetting})`, // Trigger when the top of the section reaches the middle of the viewport
        onEnter: () => {
          // Update body styles using GSAP
          gsap.to(document.body, {
            backgroundColor: bgColor,
            color: textColor,
            duration: 0.5, // Duration of the color change
          });
        },
        onLeaveBack: () => {
          if (index > 0) {
            // Ensure there's a previous section
            const prevSection = triggerElements[index - 1];
            const prevAnimateValue =
              prevSection.getAttribute("animate-body-to");
            const bgColor =
              colorThemes[prevAnimateValue - 1]["--color--background"] ||
              "#ffffff";

            const textColor =
              colorThemes[prevAnimateValue - 1]["--color--text"] || "#121212";

            // Apply the previous section's color
            gsap.to(document.body, {
              backgroundColor: bgColor,
              color: textColor,
              duration: 0.5, // Duration of the color change
            });
          }
        },
      });
    });
  }
}

window.addEventListener("DOMContentLoaded", initBodyColorChange);
