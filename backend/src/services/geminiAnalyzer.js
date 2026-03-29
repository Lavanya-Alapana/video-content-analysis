import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { config } from "../config/env.js";
import { CONTENT_CATEGORIES } from "../constants/index.js";
import logger from "../utils/logger.js";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export const analyzeWithGemini = async (framePaths) => {
  if (!config.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is required");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const results = [];

  logger.info(`Analyzing ${framePaths.length} frames with Gemini...`);

  for (let i = 0; i < framePaths.length; i++) {
    const framePath = framePaths[i];

    try {
      const imageData = fs.readFileSync(framePath);
      const base64Image = imageData.toString("base64");

      const prompt = `Analyze this image for inappropriate content. Classify as SAFE, NUDITY, VIOLENCE, or HATE.

Return ONLY valid JSON:
{
  "category": "SAFE|NUDITY|VIOLENCE|HATE",
  "nudityScore": 0.95,
  "violenceScore": 0.05,
  "confidence": 0.98,
  "reasoning": "brief explanation"
}`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ]);

      const response = result.response;
      const text = response.text();

      logger.info(
        `\n📝 ========== Frame ${i + 1}/${framePaths.length} - Full Gemini Response ==========`,
      );
      logger.info(text);
      logger.info(`========================================\n`);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        const nudityScore =
          analysis.nudityScore ||
          (analysis.category === CONTENT_CATEGORIES.NUDITY ? 0.9 : 0);
        const violenceScore =
          analysis.violenceScore ||
          (analysis.category === CONTENT_CATEGORIES.VIOLENCE ? 0.9 : 0);

        results.push({
          framePath,
          category: analysis.category,
          confidence: analysis.confidence || 0.9,
          reasoning: analysis.reasoning,
          nudityScore,
          violenceScore,
        });

        logger.success(`Frame ${i + 1} PARSED:`);
        logger.info(`   Category: ${analysis.category}`);
        logger.info(`   Nudity Score: ${nudityScore.toFixed(2)}`);
        logger.info(`   Violence Score: ${violenceScore.toFixed(2)}`);
        logger.info(`   Confidence: ${analysis.confidence}`);
        logger.info(`   Reasoning: ${analysis.reasoning}`);
        logger.info(`---\n`);
      }
    } catch (error) {
      const errorMsg = error.message || String(error);
      logger.error(`Frame ${i + 1} ERROR:`, errorMsg);

      // If blocked by safety filter, treat as explicit content
      if (errorMsg.includes("blocked") || errorMsg.includes("SAFETY")) {
        logger.warn(
          `Frame ${i + 1} blocked by safety filter - treating as NUDITY`,
        );
        results.push({
          framePath,
          category: CONTENT_CATEGORIES.NUDITY,
          confidence: 0.85,
          reasoning: "Blocked by safety filter",
          nudityScore: 0.9,
          violenceScore: 0,
        });
      } else {
        results.push({
          framePath,
          category: CONTENT_CATEGORIES.SAFE,
          confidence: 0,
          error: errorMsg,
          nudityScore: 0,
          violenceScore: 0,
        });
      }
    }
  }

  logger.success(`Analysis complete: ${results.length} frames processed`);
  return results;
};
