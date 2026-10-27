# Launch asset audit — October 22, 2026

The application is `E:/Projects/wicclaw`. Its nested `website-cloner` checkout is reference material and is excluded from the VPS image.

The supplied `website-cloner/docs/research/apple/revision/asset-inventory.json` lists 193 assets. All 193 previously served Apple reference files, including eight SF font files, were moved from `public/sites/apple` to `docs/reference-assets/apple`. They remain recoverable for research but are excluded from the Docker build. Application components and styles no longer request those paths. Browser QA checks that an old SF URL returns 404.

| Area | Launch presentation |
| --- | --- |
| Main landing page | Existing WICCLAW layout, Source Sans 3, Pixelify accents, product gallery, and local product animation retained. Images/animation are identified as concepts. |
| Preorder hero | Existing WICCLAW exterior render; optimized with Next Image. |
| Product configurator | Existing WICCLAW exterior, exploded, and layers concepts. Gallery controls retained. Visible caption identifies unverified appearance/internals. |
| Scroll scene | Existing WICCLAW concept animation replaces the Apple ports video. Forward/reverse scroll mechanics remain. Exact port labels and dimensions removed. This is not a verified engineering rotation. |
| Hardware views | No authenticated front/rear/side/top/bottom photography is available. No Apple hardware views or invented measurements are published. |
| Technical illustrations | Apple diagrams, app screenshots, chips, benchmarks, environmental badges, and accessories removed. Text describes supported workflows and unconfirmed details. The hardware information page uses the exterior concept instead of an interior diagram. |
| Comparison | Core versus upcoming hardware; no Apple chip names, benchmark multipliers, or unpriced full-payment offer. |
| Bag/checkout | WICCLAW exterior render, with fixed dimensions and responsive sizing. |
| Icons | Existing code-drawn navigation icons; simple code-rendered feature marks replace downloaded reference icons. |
| Social/favicon | Existing WICCLAW brand artwork retained. Social image metadata corrected to actual 1728 × 1117 dimensions. |
| Typography | Self-hosted Inter variable font under SIL OFL, with `public/fonts/Inter-OFL.txt`; original Source Sans 3 and Pixelify licenses retained. Main landing font is unchanged. |

## Asset gaps

Existing exterior/concept PNGs are supplied project assets, not evidence of the final manufactured configuration. Their ownership/provenance still requires the merchant's release review. Real hardware photography, an authenticated turntable sequence, physical/port drawings, included-accessory photography, packaging, measured power use, and environmental evidence are unavailable. Text and explicit concept labels cover those gaps. No new bitmap images were generated.

Original render dimensions are 1448 × 1086, except the layers concept at 1672 × 941. Product media uses contain behavior and responsive sizes; hero and shop assets reserve dimensions. Existing video is approximately 3.1 MB. The optimized browser presentation was checked at 1440, 768, 390, and 360 pixels.
