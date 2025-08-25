export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  textLight: string
}

export interface FontScheme {
  heading: string
  body: string
}

export const presetThemes = {
  modern: {
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#FFFFFF',
      text: '#1F2937',
      textLight: '#6B7280'
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    }
  },
  corporate: {
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#10B981',
      background: '#F9FAFB',
      text: '#111827',
      textLight: '#4B5563'
    },
    fonts: {
      heading: "'Roboto', sans-serif",
      body: "'Roboto', sans-serif"
    }
  },
  creative: {
    colors: {
      primary: '#DC2626',
      secondary: '#F59E0B',
      accent: '#8B5CF6',
      background: '#FEF3C7',
      text: '#451A03',
      textLight: '#92400E'
    },
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Open Sans', sans-serif"
    }
  },
  minimal: {
    colors: {
      primary: '#000000',
      secondary: '#525252',
      accent: '#A3A3A3',
      background: '#FFFFFF',
      text: '#000000',
      textLight: '#525252'
    },
    fonts: {
      heading: "'Helvetica Neue', sans-serif",
      body: "'Helvetica Neue', sans-serif"
    }
  },
  nature: {
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#84CC16',
      background: '#ECFDF5',
      text: '#064E3B',
      textLight: '#047857'
    },
    fonts: {
      heading: "'Montserrat', sans-serif",
      body: "'Source Sans Pro', sans-serif"
    }
  }
}

export class ThemeGenerator {
  static generateGradient(color1: string, color2: string, angle: number = 135): string {
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`
  }

  static generateComplementaryColor(hexColor: string): string {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    const compR = 255 - r
    const compG = 255 - g
    const compB = 255 - b
    
    return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`
  }

  static adjustBrightness(hexColor: string, factor: number): string {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    const newR = Math.min(255, Math.max(0, Math.round(r * factor)))
    const newG = Math.min(255, Math.max(0, Math.round(g * factor)))
    const newB = Math.min(255, Math.max(0, Math.round(b * factor)))
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
  }

  static generateColorPalette(baseColor: string): ColorScheme {
    return {
      primary: baseColor,
      secondary: this.adjustBrightness(baseColor, 0.8),
      accent: this.generateComplementaryColor(baseColor),
      background: '#FFFFFF',
      text: this.adjustBrightness(baseColor, 0.3),
      textLight: this.adjustBrightness(baseColor, 0.6)
    }
  }

  static getGoogleFontUrl(fonts: FontScheme): string {
    const fontFamilies = new Set([
      fonts.heading.split(',')[0].replace(/['"]/g, ''),
      fonts.body.split(',')[0].replace(/['"]/g, '')
    ])
    
    const fontParam = Array.from(fontFamilies)
      .map(font => font.replace(' ', '+') + ':wght@300;400;500;600;700;800;900')
      .join('&family=')
    
    return `https://fonts.googleapis.com/css2?family=${fontParam}&display=swap`
  }
}