import fs from "node:fs";
import os from "node:os";
import path from "node:path";
export default {
    getAccessToken: async () => {
        const tokenPath = path.join(os.homedir(), ".spotify-token");
        if (!fs.existsSync(tokenPath)) {
            throw new Error(`Token file not found at ${tokenPath}. Create this file with your Spotify access token.`);
        }
        const token = fs.readFileSync(tokenPath, "utf-8").trim();
        if (!token) {
            throw new Error("Token file is empty");
        }
        return token;
    },
};
//# sourceMappingURL=file-token-provider.js.map