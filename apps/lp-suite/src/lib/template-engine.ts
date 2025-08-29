import { TemplateConfig } from '@/types/template'

export class TemplateEngine {
  private config: TemplateConfig

  constructor(config: TemplateConfig) {
    this.config = config
  }

  generateCSSVariables(): string {
    const { theme } = this.config
    return `
      :root {
        --color-primary: ${theme.colors.primary};
        --color-secondary: ${theme.colors.secondary};
        --color-accent: ${theme.colors.accent};
        --color-background: ${theme.colors.background};
        --color-text: ${theme.colors.text};
        --color-text-light: ${theme.colors.textLight};
        --font-heading: ${theme.fonts.heading};
        --font-body: ${theme.fonts.body};
        --gradient-primary: ${theme.gradients?.primary || `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`};
        --gradient-secondary: ${theme.gradients?.secondary || `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.accent})`};
        --gradient-accent: ${theme.gradients?.accent || `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary})`};
      }
    `
  }

  getConfig(): TemplateConfig {
    return this.config
  }

  updateConfig(updates: Partial<TemplateConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.config.meta?.title) {
      errors.push('Meta title is required')
    }

    if (!this.config.theme?.colors?.primary) {
      errors.push('Primary color is required')
    }

    if (!this.config.content?.hero?.title) {
      errors.push('Hero title is required')
    }

    if (!this.config.content?.form?.fields || this.config.content.form.fields.length === 0) {
      errors.push('At least one form field is required')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2)
  }

  static fromJSON(json: string): TemplateEngine {
    try {
      const config = JSON.parse(json) as TemplateConfig
      return new TemplateEngine(config)
    } catch (error) {
      throw new Error('Invalid template configuration JSON')
    }
  }
}