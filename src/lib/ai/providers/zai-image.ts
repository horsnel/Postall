// Z.ai Image Generation — Free via z-ai-generate CLI
// This is a server-side wrapper that shells out to the CLI tool

export const zaiImageProvider = {
  name: 'Z.ai Image Generation' as const,
  isConfigured: () => true, // Always available

  async generateImage(prompt: string, options?: { size?: string }): Promise<string> {
    const { execFile } = await import('child_process');
    const { promisify } = await import('util');
    const execFileAsync = promisify(execFile);

    const size = options?.size || '1024x1024';
    const outputPath = `/tmp/zai-${Date.now()}.png`;

    try {
      await execFileAsync('z-ai-generate', ['-p', prompt, '-o', outputPath, '-s', size], {
        timeout: 60000,
      });
      // Read the generated file and convert to base64
      const { readFileSync } = await import('fs');
      const buffer = readFileSync(outputPath);
      return buffer.toString('base64');
    } catch (error) {
      throw new Error(`Z.ai image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async health() {
    return { available: true, latency: 0 };
  },
};
