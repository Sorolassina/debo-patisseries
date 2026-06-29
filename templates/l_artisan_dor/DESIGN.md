---
name: L'Artisan Doré
colors:
  surface: '#fff8f0'
  surface-dim: '#e0d9d0'
  surface-bright: '#fff8f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e9'
  surface-container: '#f4ede3'
  surface-container-high: '#eee7dd'
  surface-container-highest: '#e8e2d8'
  on-surface: '#1e1b16'
  on-surface-variant: '#4d4637'
  inverse-surface: '#33302a'
  inverse-on-surface: '#f7f0e6'
  outline: '#7e7665'
  outline-variant: '#d0c5b2'
  surface-tint: '#755b00'
  primary: '#755b00'
  on-primary: '#ffffff'
  primary-container: '#c9a84c'
  on-primary-container: '#503d00'
  inverse-primary: '#e6c364'
  secondary: '#7b5641'
  on-secondary: '#ffffff'
  secondary-container: '#ffcdb2'
  on-secondary-container: '#7a5540'
  tertiary: '#6f5959'
  on-tertiary: '#ffffff'
  tertiary-container: '#c0a5a5'
  on-tertiary-container: '#4e3b3b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe08f'
  primary-fixed-dim: '#e6c364'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#ffdbc9'
  secondary-fixed-dim: '#edbca3'
  on-secondary-fixed: '#2e1505'
  on-secondary-fixed-variant: '#613f2c'
  tertiary-fixed: '#f9dcdc'
  tertiary-fixed-dim: '#dcc0c0'
  on-tertiary-fixed: '#271718'
  on-tertiary-fixed-variant: '#564242'
  background: '#fff8f0'
  on-background: '#1e1b16'
  surface-variant: '#e8e2d8'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is built on the principles of **Haute Pâtisserie**, evoking the atmosphere of a Michelin-star French pastry shop. It targets a discerning audience that appreciates craftsmanship, heritage, and the sensory experience of fine desserts.

The visual style is a blend of **Luxury Minimalism** and **Tactile Elegance**. It avoids the sterility of modern tech-focused minimalism in favor of a warm, inviting aesthetic. High-quality editorial photography is the cornerstone of the brand, supported by ample whitespace that allows each "pastry portrait" to breathe. The overall emotional response should be one of indulgence, calm, and uncompromising quality.

## Colors

The palette is inspired by the raw ingredients and refined finishes of French baking:

*   **Primary (Champagne Gold):** Used for accents, interactive states, and premium signaling. It represents the "golden hour" of a perfectly baked crust.
*   **Secondary (Chocolate Brown):** The foundation for typography and high-contrast UI elements. It provides depth and a sense of grounding.
*   **Tertiary (Blush Pink):** A soft, romantic accent used for secondary buttons, seasonal badges, and delicate dividers.
*   **Neutral (Creamy Off-White):** The canvas for the entire system. It replaces pure white to create a warmer, more sophisticated atmosphere.

Color usage should prioritize the Neutral background, with Secondary used for the majority of text to ensure high legibility while maintaining a soft, organic feel.

## Typography

This design system employs a classic high-contrast pairing:

*   **Headlines:** *Playfair Display* provides a sophisticated, editorial feel. Use this for product titles, section headers, and brand statements. It should always be set in the Secondary (Chocolate Brown) color.
*   **Body & UI:** *DM Sans* is used for descriptions, ingredient lists, and interface controls. Its low-contrast, geometric nature provides a clean counterpoint to the decorative serif.
*   **Labels:** Small UI labels and category tags use *DM Sans* with increased letter spacing and uppercase styling to evoke the appearance of luxury product packaging.

## Layout & Spacing

The layout philosophy follows a **Fixed Centered Grid** for desktop to maintain an editorial, boutique feel, transitioning to a fluid model for mobile.

*   **Desktop:** A 12-column grid with a maximum width of 1200px. Large margins (64px) ensure the content feels exclusive and uncrowded.
*   **Mobile:** A 4-column fluid grid.
*   **Rhythm:** An 8px base grid is used for component internal spacing, while layout sections use larger increments (32px, 64px, 128px) to create a distinct sense of hierarchy and "breathable" luxury.

## Elevation & Depth

The design system uses **Ambient Shadows** and **Tonal Layering** to create a soft, physical presence without looking "digital."

*   **Surfaces:** The primary background is the Neutral Cream. Overlays and cards use the same color but are elevated with shadows.
*   **Shadows:** Shadows are extremely diffused, using a low-opacity Secondary (Chocolate Brown) tint rather than pure black. This mimics the soft lighting of a high-end patisserie.
*   **Floating Elements:** Elements like the navigation bar and primary action buttons use a slightly higher elevation to suggest they are "resting" on top of the surface.

## Shapes

The shape language is characterized by **Generous Curvature**.

*   **Corners:** A standard radius of 20px is applied to all primary containers, product cards, and large buttons. This softness removes any "industrial" feel and mimics the organic shapes of pastries and desserts.
*   **Pills:** Smaller interactive elements like selection chips and tags use a fully rounded "pill" shape to distinguish them from structural elements.

## Components

*   **Elegant Cards:** Feature high-resolution imagery with a 4:5 aspect ratio. Content is placed below the image on the Neutral background. The entire card uses a 20px border radius and a subtle ambient shadow on hover.
*   **Floating Navigation:** A centered, slim navigation bar that floats at the top or bottom of the viewport. It uses a semi-transparent version of the Neutral color with a backdrop-blur and a refined 20px radius.
*   **Selection Chips:** Used for filtering flavors or dietary preferences. Unselected states are outlined in Primary Gold; selected states are filled with Blush Pink with Chocolate Brown text.
*   **Buttons:**
    *   *Primary:* Solid Primary Gold with Chocolate Brown text.
    *   *Secondary:* Solid Blush Pink or outlined Chocolate Brown.
    *   All buttons feature 20px rounded corners and a subtle lifting animation on hover.
*   **Input Fields:** Clean, minimal fields with only a bottom border in Primary Gold when focused. Error states use a muted terracotta (avoiding harsh reds).
*   **Product Badges:** Small, circular or pill-shaped badges (e.g., "Seasonal," "Chef's Choice") using the Blush Pink color and Label-sm typography.