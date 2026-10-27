import { writeFile } from "node:fs/promises";

const oversizedHeroVideo = "site/wicclaw/hf_20261024_051414_3950d08f-8ed2-4549-a0e9-ca75493928e1.mp4";

await writeFile(".open-next/assets/.assetsignore", `${oversizedHeroVideo}\n`, "utf8");
