import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

const THINKING_SUFFIX_REGEX = /-thinking$/;
const AGNIC_GATEWAY_BASE_URL =
  process.env.AGNIC_GATEWAY_BASE_URL || "https://api.agnic.ai/v1";

const agnicGateway = createOpenAICompatible({
  name: "agnic",
  baseURL: AGNIC_GATEWAY_BASE_URL,
  apiKey: process.env.AGNIC_API_KEY,
  headers: process.env.AGNIC_API_KEY
    ? {
        "X-Agnic-Token": process.env.AGNIC_API_KEY,
      }
    : undefined,
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  const isReasoningModel =
    modelId.includes("reasoning") || modelId.endsWith("-thinking");

  if (isReasoningModel) {
    const gatewayModelId = modelId.replace(THINKING_SUFFIX_REGEX, "");

    return wrapLanguageModel({
      model: agnicGateway.languageModel(gatewayModelId),
      middleware: extractReasoningMiddleware({ tagName: "thinking" }),
    });
  }

  return agnicGateway.languageModel(modelId);
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  return agnicGateway.languageModel("openai/gpt-4o-mini");
}

export function getArtifactModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("artifact-model");
  }
  return agnicGateway.languageModel("openai/gpt-4o-mini");
}
